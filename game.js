// SnakeSats Game - Bitcoin Education Game
class SnakeSats {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameMessage = document.getElementById('gameMessage');
        
        // Device detection
        this.isMobile = this.detectMobile();
        this.setupCanvas();
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.satsCollected = 0;
        this.goodPractices = 0;
        this.fiatHit = 0;
        this.bestScore = localStorage.getItem('snakeSatsBestScore') || 0;
        
        // Speed progression system
        this.currentSpeed = 300; // Initial speed (good for beginners)
        this.speedLevel = 1;
        this.maxSpeedLevel = 21; // 21 levels for 21 million Bitcoin
        this.speedChangeInterval = 20000; // 20 seconds
        this.countdownTime = 5000; // 5 seconds countdown
        this.lastSpeedChange = 0;
        this.countdownActive = false;
        this.countdownValue = 5;
        
        // Object generation timers
        this.lastSatSpawn = 0;
        this.lastFiatSpawn = 0;
        this.lastDoSpawn = 0;
        this.satSpawnInterval = 3000; // 3 seconds
        this.fiatSpawnInterval = 4000; // 4 seconds
        this.doSpawnInterval = 8000; // 8 seconds
        
        // Game objects
        this.snake = [];
        this.direction = {x: 0, y: 0};
        this.sats = [];
        this.fiats = [];
        this.dos = [];
        
        // Game settings - Updated for Normal and Legendary only
        this.difficulty = 'normal';
        this.difficultySettings = {
            normal: { 
                initialSpeed: 300, // Good starting speed
                speedIncrement: 25, 
                healthGain: 8, 
                fiatDamage: 25
            },
            legendary: { 
                initialSpeed: 200, // Faster than normal for challenge
                speedIncrement: 30, 
                healthGain: 5, 
                fiatDamage: 30
            }
        };
        
        // Sound system
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.audioContext = null;
        this.sounds = {};
        
        // Mobile touch controls
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastTapTime = 0;
        
        // Bitcoin tips system
        this.tipsEnabled = true;
        this.lastTipUpdate = 0;
        this.tipUpdateInterval = 8000; // 8 seconds between tip changes
        this.tipDelay = 3000; // 3 seconds delay before first tip
        this.currentTipIndex = 0;
        this.tips = [
            "💡 Stack sats regularly - consistency beats timing!",
            "🔒 Self-custody is key - not your keys, not your coins!",
            "📈 DCA (Dollar Cost Average) reduces emotional trading",
            "❄️ Cold storage keeps your Bitcoin safe from hackers",
            "🚫 Avoid FOMO - stick to your investment plan",
            "💰 Bitcoin is scarce - only 21 million will ever exist",
            "⚡ Lightning Network enables fast, cheap transactions",
            "🌍 Bitcoin is global money for the internet age",
            "🎯 Long-term thinking beats short-term speculation",
            "🔐 Hardware wallets provide maximum security",
            "📊 Market cycles are normal - stay the course",
            "🌱 Bitcoin is the future of money"
        ];
        
        this.init();
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }
    
    setupCanvas() {
        if (this.isMobile) {
            // Mobile canvas setup - improved responsive sizing
            const maxSize = Math.min(window.innerWidth - 40, window.innerHeight - 200);
            this.canvas.width = maxSize;
            this.canvas.height = maxSize;
            this.gridSize = Math.floor(maxSize / 20);
        } else {
            // Desktop canvas setup - increased from 400x400 to 600x600
            this.canvas.width = 600;
            this.canvas.height = 600;
            this.gridSize = 30; // Increased from 20 to maintain proportional grid density
        }
        
        // Initialize snake position based on new grid size
        this.initializeSnakePosition();
        
        // Log canvas setup for debugging
        console.log(`Canvas setup - Size: ${this.canvas.width}x${this.canvas.height}, Grid: ${this.gridSize}, Mobile: ${this.isMobile}`);
    }
    
    initializeSnakePosition() {
        // Calculate center position based on grid size
        const centerX = Math.floor(this.gridSize / 2);
        const centerY = Math.floor(this.gridSize / 2);
        this.snake = [{x: centerX, y: centerY}];
        this.direction = {x: 0, y: 0};
        
        console.log(`Snake initialized at position: (${centerX}, ${centerY}) on ${this.gridSize}x${this.gridSize} grid`);
    }
    
    init() {
        this.initSoundSystem();
        this.setupEventListeners();
        this.setupCollapsibleSections();
        this.setupMobileControls();
        this.setupInitialBitcoinTips(); // Set up initial tips
        this.updateStats();
        this.updateMobileStats();
        this.showMessage('Press Start to begin your Bitcoin journey! 🚀');
    }
    
    setupInitialBitcoinTips() {
        // Set initial welcome message for tips
        const welcomeTip = "🎮 Welcome to SnakeSats! Learn Bitcoin while you play!";
        
        // Set desktop tip
        const tipContent = document.getElementById('tipContent');
        if (tipContent) {
            tipContent.innerHTML = `<p>${welcomeTip}</p>`;
        }
        
        // Set mobile tip
        const mobileTipContent = document.getElementById('mobileTipContent');
        if (mobileTipContent) {
            mobileTipContent.innerHTML = `<p>${welcomeTip}</p>`;
        }
    }
    
    initSoundSystem() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (error) {
            console.log('Audio not supported');
        }
    }
    
    createSounds() {
        this.sounds = {
            collect: this.createTone(800, 0.1, 'sine'),
            damage: this.createTone(200, 0.2, 'sawtooth'),
            levelUp: this.createTone(1200, 0.3, 'sine'),
            gameOver: this.createTone(150, 0.5, 'square')
        };
    }
    
    createTone(frequency, duration, type) {
        return () => {
            if (!this.audioContext || !this.soundEnabled) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
    
    setupEventListeners() {
        // Desktop controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y !== 1) {
                        this.direction = {x: 0, y: -1};
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y !== -1) {
                        this.direction = {x: 0, y: 1};
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x !== 1) {
                        this.direction = {x: -1, y: 0};
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x !== -1) {
                        this.direction = {x: 1, y: 0};
                    }
                    break;
                case ' ':
                case 'p':
                case 'P':
                    e.preventDefault();
                    this.togglePause();
                    break;
            }
        });
        
        // Game control buttons
        const startBtn = document.getElementById('startBtn');
        const pauseBtn = document.getElementById('pauseBtn');
        const restartBtn = document.getElementById('restartBtn');
        
        if (startBtn) startBtn.addEventListener('click', () => this.startGame());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.togglePause());
        if (restartBtn) restartBtn.addEventListener('click', () => this.restartGame());
        
        // Mobile control buttons
        const mobileStartBtn = document.getElementById('mobileStartBtn');
        const mobilePauseBtn = document.getElementById('mobilePauseBtn');
        const mobileRestartBtn = document.getElementById('mobileRestartBtn');
        
        if (mobileStartBtn) mobileStartBtn.addEventListener('click', () => this.startGame());
        if (mobilePauseBtn) mobilePauseBtn.addEventListener('click', () => this.togglePause());
        if (mobileRestartBtn) mobileRestartBtn.addEventListener('click', () => this.restartGame());
        
        // Sound controls
        const soundToggle = document.getElementById('soundToggle');
        const musicToggle = document.getElementById('musicToggle');
        const mobileSoundToggle = document.getElementById('mobileSoundToggle');
        const mobileMusicToggle = document.getElementById('mobileMusicToggle');
        
        if (soundToggle) soundToggle.addEventListener('click', () => this.toggleSound());
        if (musicToggle) musicToggle.addEventListener('click', () => this.toggleMusic());
        if (mobileSoundToggle) mobileSoundToggle.addEventListener('click', () => this.toggleSound());
        if (mobileMusicToggle) mobileMusicToggle.addEventListener('click', () => this.toggleMusic());
        
        // Difficulty selection
        this.setupDifficultySelection();
        
        // Mobile info drawer controls
        const mobileInfoBtn = document.getElementById('mobileInfoBtn');
        const closeInfoBtn = document.getElementById('closeInfoBtn');
        
        if (mobileInfoBtn) mobileInfoBtn.addEventListener('click', () => this.toggleMobileDrawer('info'));
        if (closeInfoBtn) closeInfoBtn.addEventListener('click', () => this.closeMobileDrawer('info'));
    }
    
    setupMobileControls() {
        if (!this.isMobile) return;
        
        // Touch controls for canvas
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - this.touchStartX;
            const deltaY = touch.clientY - this.touchStartY;
            
            // Check for tap vs swipe
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const currentTime = Date.now();
            
            if (distance < 10) {
                // Tap detected
                if (currentTime - this.lastTapTime < 300) {
                    // Double tap - restart game
                    this.restartGame();
                } else {
                    // Single tap - pause/resume
                    this.togglePause();
                }
                this.lastTapTime = currentTime;
            } else {
                // Swipe detected
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    // Horizontal swipe
                    if (deltaX > 0 && this.direction.x !== -1) {
                        this.direction = {x: 1, y: 0};
                    } else if (deltaX < 0 && this.direction.x !== 1) {
                        this.direction = {x: -1, y: 0};
                    }
                } else {
                    // Vertical swipe
                    if (deltaY > 0 && this.direction.y !== -1) {
                        this.direction = {x: 0, y: 1};
                    } else if (deltaY < 0 && this.direction.y !== 1) {
                        this.direction = {x: 0, y: -1};
                    }
                }
            }
        });
    }
    
    toggleMobileDrawer(type) {
        const drawer = document.getElementById(`mobile${type.charAt(0).toUpperCase() + type.slice(1)}Drawer`);
        if (drawer) {
            drawer.style.display = 'block';
            setTimeout(() => {
                drawer.classList.add('active');
            }, 10);
        }
    }
    
    closeMobileDrawer(type) {
        const drawer = document.getElementById(`mobile${type.charAt(0).toUpperCase() + type.slice(1)}Drawer`);
        if (drawer) {
            drawer.classList.remove('active');
            setTimeout(() => {
                drawer.style.display = 'none';
            }, 300);
        }
    }
    
    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.updateSoundButtons();
    }
    
    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        this.updateSoundButtons();
    }
    
    updateSoundButtons() {
        const buttons = [
            document.getElementById('soundToggle'),
            document.getElementById('mobileSoundToggle')
        ];
        
        buttons.forEach(btn => {
            if (btn) {
                btn.classList.toggle('active', this.soundEnabled);
            }
        });
        
        const musicButtons = [
            document.getElementById('musicToggle'),
            document.getElementById('mobileMusicToggle')
        ];
        
        musicButtons.forEach(btn => {
            if (btn) {
                btn.classList.toggle('active', this.musicEnabled);
            }
        });
    }
    
    setupDifficultySelection() {
        const difficultyButtons = document.querySelectorAll('.difficulty-btn, .mobile-difficulty-btn');
        
        difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const difficulty = btn.dataset.difficulty;
                this.setDifficulty(difficulty);
                
                // Update all difficulty buttons
                document.querySelectorAll('.difficulty-btn, .mobile-difficulty-btn').forEach(b => {
                    b.classList.remove('active');
                });
                document.querySelectorAll(`[data-difficulty="${difficulty}"]`).forEach(b => {
                    b.classList.add('active');
                });
            });
        });
    }
    
    setDifficulty(difficulty) {
        this.difficulty = difficulty;
        this.updateStats();
        this.resetSpeedProgression(); // Reset speed progression when difficulty changes
    }
    
    setupCollapsibleSections() {
        const toggles = document.querySelectorAll('.section-toggle');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const section = toggle.closest('.control-section');
                const isActive = section.classList.contains('active');
                
                // Close all sections
                document.querySelectorAll('.control-section').forEach(s => {
                    s.classList.remove('active');
                });
                
                // Open clicked section if it wasn't active
                if (!isActive) {
                    section.classList.add('active');
                }
            });
        });
        
        // Auto-expand game controls on desktop
        if (!this.isMobile) {
            const gameControlsSection = document.querySelector('.control-section');
            if (gameControlsSection) {
                gameControlsSection.classList.add('active');
            }
        }
    }
    
    updateBitcoinTips() {
        if (!this.tipsEnabled) return;
        
        const currentTime = Date.now();
        const gameStartTime = this.gameStartTime || currentTime;
        
        // Check if enough time has passed since game start for first tip
        if (currentTime - gameStartTime < this.tipDelay) {
            return;
        }
        
        // Check if it's time to update the tip
        if (currentTime - this.lastTipUpdate >= this.tipUpdateInterval) {
            this.rotateBitcoinTip();
            this.lastTipUpdate = currentTime;
        }
    }
    
    rotateBitcoinTip() {
        // Get next tip with smooth transition
        const nextTip = this.tips[this.currentTipIndex];
        
        // Update desktop tip
        const tipContent = document.getElementById('tipContent');
        if (tipContent) {
            this.fadeTipTransition(tipContent, nextTip);
        }
        
        // Update mobile tip
        const mobileTipContent = document.getElementById('mobileTipContent');
        if (mobileTipContent) {
            this.fadeTipTransition(mobileTipContent, nextTip);
        }
        
        // Move to next tip
        this.currentTipIndex = (this.currentTipIndex + 1) % this.tips.length;
        
        console.log(`Bitcoin tip rotated: ${nextTip}`);
    }
    
    fadeTipTransition(element, newTip) {
        // Add fade out effect
        element.style.opacity = '0.3';
        element.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            element.innerHTML = `<p>${newTip}</p>`;
            element.style.opacity = '1';
        }, 250);
    }
    
    startGame() {
        if (this.gameRunning) return;
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.direction = {x: 1, y: 0};
        
        // Use the new snake initialization method
        this.initializeSnakePosition();
        
        this.sats = [];
        this.fiats = [];
        this.dos = [];
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.satsCollected = 0;
        this.goodPractices = 0;
        this.fiatHit = 0;
        
        // Initialize speed progression
        this.resetSpeedProgression();
        
        // Initialize Bitcoin tips system
        this.gameStartTime = Date.now();
        this.lastTipUpdate = 0;
        this.currentTipIndex = 0;
        
        // Reset object generation timers
        this.lastSatSpawn = 0;
        this.lastFiatSpawn = 0;
        this.lastDoSpawn = 0;
        this.satSpawnInterval = 3000;
        this.fiatSpawnInterval = 4000;
        this.doSpawnInterval = 8000;
        
        this.updateButtonStates();
        this.hideMessage();
        this.gameLoop();
    }
    
    restartGame() {
        this.gameRunning = false;
        this.gamePaused = false;
        this.startGame();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        this.updateButtonStates();
        
        if (this.gamePaused) {
            this.showMessage('Game Paused - Press P or tap to resume');
        } else {
            this.hideMessage();
            this.gameLoop();
        }
    }
    
    updateButtonStates() {
        const buttons = [
            { start: document.getElementById('startBtn'), pause: document.getElementById('pauseBtn'), restart: document.getElementById('restartBtn') },
            { start: document.getElementById('mobileStartBtn'), pause: document.getElementById('mobilePauseBtn'), restart: document.getElementById('mobileRestartBtn') }
        ];
        
        buttons.forEach(btnSet => {
            if (btnSet.start) btnSet.start.disabled = this.gameRunning;
            if (btnSet.pause) btnSet.pause.disabled = !this.gameRunning;
            if (btnSet.restart) btnSet.restart.disabled = !this.gameRunning;
        });
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        this.updateSpeedProgression();
        this.updateBitcoinTips(); // Add Bitcoin tips update
        
        setTimeout(() => this.gameLoop(), this.currentSpeed);
    }
    
    updateSpeedProgression() {
        const currentTime = Date.now();
        
        // Speed increases based on sats collected (more responsive)
        const satsForSpeedIncrease = 2; // Every 2 sats collected for faster progression
        const timeForSpeedIncrease = 10000; // Every 10 seconds as backup
        
        // Check if enough sats collected for speed increase
        if (this.satsCollected >= satsForSpeedIncrease * this.speedLevel && this.speedLevel < this.maxSpeedLevel && !this.countdownActive) {
            console.log(`Speed increase triggered! Sats: ${this.satsCollected}, Required: ${satsForSpeedIncrease * this.speedLevel}, Level: ${this.speedLevel}`);
            this.startCountdown();
        }
        
        // Also check time-based progression as backup
        if (currentTime - this.lastSpeedChange >= timeForSpeedIncrease && this.speedLevel < this.maxSpeedLevel && !this.countdownActive) {
            this.startCountdown();
        }
        
        // Update countdown
        if (this.countdownActive) {
            const timeSinceCountdownStart = currentTime - this.lastSpeedChange;
            const newCountdownValue = Math.ceil((this.countdownTime - timeSinceCountdownStart) / 1000);
            
            if (newCountdownValue !== this.countdownValue) {
                this.countdownValue = newCountdownValue;
                this.updateCountdownDisplay();
            }
            
            // Check if countdown is complete
            if (timeSinceCountdownStart >= this.countdownTime) {
                this.increaseSpeed();
            }
        }
    }
    
    startCountdown() {
        this.countdownActive = true;
        this.countdownValue = 5;
        this.lastSpeedChange = Date.now();
        this.updateCountdownDisplay();
        this.playSound('levelUp');
    }
    
    increaseSpeed() {
        this.countdownActive = false;
        this.speedLevel++;
        
        const settings = this.difficultySettings[this.difficulty];
        // Calculate new speed with more responsive progression
        const newSpeed = Math.max(
            settings.initialSpeed - (this.speedLevel - 1) * settings.speedIncrement,
            30 // Minimum speed (very fast)
        );
        
        this.currentSpeed = newSpeed;
        this.lastSpeedChange = Date.now();
        
        // Visual feedback
        this.showSpeedChangeMessage();
        this.updateSpeedDisplay();
        
        // Add visual speed effect
        this.addSpeedEffect();
        
        // Log speed for debugging
        console.log(`Speed increased to: ${newSpeed}ms (Level ${this.speedLevel}) - Sats collected: ${this.satsCollected}`);
    }
    
    updateCountdownDisplay() {
        const countdownElement = document.getElementById('speedCountdown');
        const countdownRow = document.getElementById('speedCountdownRow');
        if (countdownElement && countdownRow) {
            countdownElement.textContent = `${this.countdownValue}s`;
            countdownRow.style.display = 'block';
        }
    }
    
    updateSpeedDisplay() {
        const speedElement = document.getElementById('currentSpeed');
        if (speedElement) {
            speedElement.textContent = `Speed Level: ${this.speedLevel}/21`;
        }
    }
    
    showSpeedChangeMessage() {
        this.showMessage(`🚀 SPEED INCREASED! Level ${this.speedLevel}/21 - Game is getting faster! ⚡`);
        setTimeout(() => this.hideMessage(), 3000);
    }
    
    addSpeedEffect() {
        // Add a visual flash effect when speed increases
        const canvas = this.canvas;
        const originalFillStyle = this.ctx.fillStyle;
        
        // Flash effect
        this.ctx.fillStyle = '#f7931a';
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        this.ctx.globalAlpha = 1.0;
        
        // Reset after flash
        setTimeout(() => {
            this.ctx.fillStyle = originalFillStyle;
        }, 200);
    }
    
    resetSpeedProgression() {
        this.currentSpeed = this.difficultySettings[this.difficulty].initialSpeed;
        this.speedLevel = 1;
        this.countdownActive = false;
        this.countdownValue = 5;
        this.lastSpeedChange = 0;
        
        // Hide countdown display
        const countdownElement = document.getElementById('speedCountdown');
        const countdownRow = document.getElementById('speedCountdownRow');
        if (countdownElement && countdownRow) {
            countdownElement.textContent = 'Ready';
            countdownRow.style.display = 'none';
        }
        
        this.updateSpeedDisplay();
    }
    
    update() {
        // Move snake
        const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};
        
        // Check wall collision
        const gridWidth = this.canvas.width / this.gridSize;
        const gridHeight = this.canvas.height / this.gridSize;
        
        if (head.x < 0 || head.x >= gridWidth || head.y < 0 || head.y >= gridHeight) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Check sat collection
        const satIndex = this.sats.findIndex(sat => sat.x === head.x && sat.y === head.y);
        if (satIndex !== -1) {
            this.sats.splice(satIndex, 1);
            this.score += 10;
            this.satsCollected++;
            this.health = Math.min(this.maxHealth, this.health + this.difficultySettings[this.difficulty].healthGain);
            this.playSound('collect');
            this.generateSat();
            
            // Debug: Log sat collection for speed progression
            console.log(`Sat collected! Total: ${this.satsCollected}, Speed Level: ${this.speedLevel}, Current Speed: ${this.currentSpeed}ms`);
        }
        
        // Check fiat collision
        const fiatIndex = this.fiats.findIndex(fiat => fiat.x === head.x && fiat.y === head.y);
        if (fiatIndex !== -1) {
            this.fiats.splice(fiatIndex, 1);
            this.health -= this.difficultySettings[this.difficulty].fiatDamage;
            this.fiatHit++;
            this.playSound('damage');
            this.generateFiat();
        }
        
        // Check do collection
        const doIndex = this.dos.findIndex(doItem => doItem.x === head.x && doItem.y === head.y);
        if (doIndex !== -1) {
            this.dos.splice(doIndex, 1);
            this.score += 20;
            this.goodPractices++;
            this.playSound('collect');
            this.generateDo();
        }
        
        // Remove tail if no sat collected
        if (satIndex === -1 && fiatIndex === -1 && doIndex === -1) {
            this.snake.pop();
        }
        
        // Generate objects with random intervals
        const currentTime = Date.now();
        
        // Generate sats at random intervals (2-6 seconds)
        if (currentTime - this.lastSatSpawn > this.satSpawnInterval && this.sats.length < 3) {
            this.generateSat();
            this.lastSatSpawn = currentTime;
            this.satSpawnInterval = 2000 + Math.random() * 4000; // 2-6 seconds
        }
        
        // Generate fiats at random intervals (3-8 seconds)
        if (currentTime - this.lastFiatSpawn > this.fiatSpawnInterval && this.fiats.length < 2) {
            this.generateFiat();
            this.lastFiatSpawn = currentTime;
            this.fiatSpawnInterval = 3000 + Math.random() * 5000; // 3-8 seconds
        }
        
        // Generate do's at random intervals (5-12 seconds)
        if (currentTime - this.lastDoSpawn > this.doSpawnInterval && this.dos.length < 1) {
            this.generateDo();
            this.lastDoSpawn = currentTime;
            this.doSpawnInterval = 5000 + Math.random() * 7000; // 5-12 seconds
        }
        
        // Check level up
        if (this.score >= this.level * 100 && this.health >= 50) {
            this.levelUp();
        }
        
        // Check game over
        if (this.health <= 0) {
            this.gameOver();
            return;
        }
        
        this.updateStats();
        this.updateMobileStats();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0e14';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (subtle)
        this.ctx.strokeStyle = '#1a2332';
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
        
        // Draw snake
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#f7931a';
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
                
                // Eyes
                this.ctx.fillStyle = '#0a0e14';
                const eyeSize = 3;
                const eyeOffset = 5;
                this.ctx.fillRect(segment.x * this.gridSize + eyeOffset, segment.y * this.gridSize + eyeOffset, eyeSize, eyeSize);
                this.ctx.fillRect(segment.x * this.gridSize + this.gridSize - eyeOffset - eyeSize, segment.y * this.gridSize + eyeOffset, eyeSize, eyeSize);
            } else {
                // Body
                this.ctx.fillStyle = `hsl(35, 100%, ${60 - index * 2}%)`;
                this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize, this.gridSize);
            }
        });
        
        // Draw sats
        this.sats.forEach(sat => {
            this.ctx.fillStyle = '#f7931a';
            this.ctx.beginPath();
            this.ctx.arc(
                sat.x * this.gridSize + this.gridSize / 2,
                sat.y * this.gridSize + this.gridSize / 2,
                this.gridSize / 2 - 2,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
            
            // Sat symbol
            this.ctx.fillStyle = '#0a0e14';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('₿', sat.x * this.gridSize + this.gridSize / 2, sat.y * this.gridSize + this.gridSize / 2 + 4);
        });
        
        // Draw fiats (dollar signs)
        this.fiats.forEach(fiat => {
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillRect(fiat.x * this.gridSize, fiat.y * this.gridSize, this.gridSize, this.gridSize);
            
            // Dollar symbol
            this.ctx.fillStyle = '#0a0e14';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('💵', fiat.x * this.gridSize + this.gridSize / 2, fiat.y * this.gridSize + this.gridSize / 2 + 4);
        });
        
        // Draw do's (green paths)
        this.dos.forEach(doItem => {
            this.ctx.fillStyle = '#51cf66';
            this.ctx.fillRect(doItem.x * this.gridSize, doItem.y * this.gridSize, this.gridSize, this.gridSize);
            
            // Checkmark symbol
            this.ctx.fillStyle = '#0a0e14';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('✅', doItem.x * this.gridSize + this.gridSize / 2, doItem.y * this.gridSize + this.gridSize / 2 + 4);
        });
        
        // Draw health bar
        this.drawHealthBar();
    }
    
    drawHealthBar() {
        const barWidth = 200;
        const barHeight = 10;
        const x = (this.canvas.width - barWidth) / 2;
        const y = this.canvas.height - 20;
        
        // Background
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x, y, barWidth, barHeight);
        
        // Health bar
        const healthWidth = (this.health / this.maxHealth) * barWidth;
        const healthColor = this.health > 50 ? '#51cf66' : this.health > 25 ? '#ffd43b' : '#ff6b6b';
        this.ctx.fillStyle = healthColor;
        this.ctx.fillRect(x, y, healthWidth, barHeight);
        
        // Border
        this.ctx.strokeStyle = '#f7931a';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, barWidth, barHeight);
    }
    
    generateSat() {
        const position = this.getRandomPosition();
        if (position) {
            this.sats.push(position);
        }
    }
    
    generateFiat() {
        const position = this.getRandomPosition();
        if (position) {
            this.fiats.push(position);
        }
    }
    
    generateDo() {
        const position = this.getRandomPosition();
        if (position) {
            this.dos.push(position);
        }
    }
    
    getRandomPosition() {
        const gridWidth = this.canvas.width / this.gridSize;
        const gridHeight = this.canvas.height / this.gridSize;
        
        for (let attempts = 0; attempts < 50; attempts++) {
            const x = Math.floor(Math.random() * gridWidth);
            const y = Math.floor(Math.random() * gridHeight);
            
            if (!this.isPositionOccupied(x, y)) {
                return {x, y};
            }
        }
        return null;
    }
    
    isPositionOccupied(x, y) {
        return this.snake.some(segment => segment.x === x && segment.y === y) ||
               this.sats.some(sat => sat.x === x && sat.y === y) ||
               this.fiats.some(fiat => fiat.x === x && fiat.y === y) ||
               this.dos.some(doItem => doItem.x === x && doItem.y === y);
    }
    
    levelUp() {
        this.level++;
        this.playSound('levelUp');
        this.showMessage(`Level ${this.level}! Keep stacking those sats! 🚀`);
        setTimeout(() => this.hideMessage(), 2000);
    }
    
    gameOver() {
        this.gameRunning = false;
        this.gamePaused = false;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('snakeSatsBestScore', this.bestScore);
        }
        
        this.playSound('gameOver');
        this.showMessage(`Game Over! Final Score: ${this.score} | Best: ${this.bestScore}`);
        this.updateButtonStates();
        this.updateStats();
        this.updateMobileStats();
    }
    
    updateScore() {
        const scoreElements = [
            document.getElementById('score'),
            document.getElementById('mobile-score')
        ];
        
        scoreElements.forEach(el => {
            if (el) el.textContent = this.score;
        });
    }
    
    updateStats() {
        // Desktop stats
        const elements = {
            'satsCollected': this.satsCollected,
            'snakeLength': this.snake.length,
            'goodPractices': this.goodPractices,
            'currentLevel': this.level,
            'currentDifficulty': this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
        
        this.updateScore();
        
        // Bitcoin tips are now handled by the timing system
        // No need to update here anymore
    }
    
    updateMobileStats() {
        if (!this.isMobile) return;
        
        // Update mobile header stats
        const mobileElements = {
            'mobile-score': this.score,
            'mobile-level': this.level,
            'mobile-health': this.health,
            'mobile-best': this.bestScore
        };
        
        Object.entries(mobileElements).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        });
        
        // Bitcoin tips are now handled by the timing system
        // No need to update here anymore
    }
    
    showMessage(text) {
        if (this.gameMessage) {
            this.gameMessage.textContent = text;
            this.gameMessage.style.display = 'block';
        }
    }
    
    hideMessage() {
        if (this.gameMessage) {
            this.gameMessage.style.display = 'none';
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeSats();
    // Expose game instance globally for testing
    window.gameInstance = game;
    
    // Load test scripts for validation
    const testScript = document.createElement('script');
    testScript.src = 'test_canvas_size.js';
    document.head.appendChild(testScript);
    
    const tipsTestScript = document.createElement('script');
    tipsTestScript.src = 'test_bitcoin_tips.js';
    document.head.appendChild(tipsTestScript);
}); 
// SnakeSats Game - Bitcoin Education Game
class SnakeSats {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.healthElement = document.getElementById('health');
        this.bestScoreElement = document.getElementById('best-score');
        this.tipDisplay = document.getElementById('tip-display');
        this.gameMessage = document.getElementById('game-message');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.restartBtn = document.getElementById('restart-btn');
        
        // Stats elements
        this.currentScoreElement = document.getElementById('current-score');
        this.snakeLengthElement = document.getElementById('snake-length');
        this.satsCollectedElement = document.getElementById('sats-collected');
        this.goodPracticesElement = document.getElementById('good-practices');
        this.currentDifficultyElement = document.getElementById('current-difficulty');
        
        // Sound controls
        this.soundToggle = document.getElementById('sound-toggle');
        this.musicToggle = document.getElementById('music-toggle');
        
        // Difficulty selector
        this.difficultySelector = document.getElementById('difficulty-selector');
        this.difficultyButtons = document.querySelectorAll('.difficulty-btn');
        
        // Game state
        this.gameRunning = false;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.health = 100;
        this.maxHealth = 100;
        this.bestScore = localStorage.getItem('snakesats-best') || 0;
        this.bestScoreElement.textContent = this.bestScore;
        
        // Difficulty settings
        this.difficulty = 'normal';
        this.difficultySettings = {
            beginner: {
                speed: 200,
                speedIncrease: 5,
                healthGain: 15,
                fiatDamage: 10,
                fiatSpawnRate: 0.3
            },
            normal: {
                speed: 150,
                speedIncrease: 10,
                healthGain: 10,
                fiatDamage: 20,
                fiatSpawnRate: 0.5
            },
            legendary: {
                speed: 100,
                speedIncrease: 15,
                healthGain: 5,
                fiatDamage: 30,
                fiatSpawnRate: 0.8
            }
        };
        
        // Stats tracking
        this.satsCollected = 0;
        this.goodPractices = 0;
        this.fiatHit = 0;
        
        // Game settings
        this.gridSize = 20;
        this.speed = this.difficultySettings[this.difficulty].speed;
        this.speedIncrease = this.difficultySettings[this.difficulty].speedIncrease;
        
        // Snake
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 0, y: 0};
        this.nextDirection = {x: 0, y: 0};
        
        // Game objects
        this.sats = [];
        this.fiats = [];
        this.dos = [];
        
        // Sound system
        this.sounds = {};
        this.audioContext = null;
        this.initSoundSystem();
        
        // Educational content
        this.bitcoinTips = [
            "Stack sats regularly and practice self-custody!",
            "Never invest more than you can afford to lose.",
            "Keep your private keys secure and offline.",
            "Dollar Cost Averaging (DCA) reduces timing risk.",
            "Not your keys, not your coins - use cold storage!",
            "Bitcoin is scarce - only 21 million will ever exist.",
            "Lightning Network enables instant, low-fee transactions.",
            "Bitcoin is decentralized - no single point of failure.",
            "HODL through volatility - Bitcoin is a long-term play.",
            "Verify, don't trust - always do your own research.",
            "Fiat currency loses value over time due to inflation.",
            "Bitcoin is deflationary - supply is fixed and decreasing.",
            "Self-custody means you control your own money.",
            "Exchanges can be hacked - not your keys, not your coins!",
            "Bitcoin is the hardest money ever created."
        ];
        
        this.fiatMessages = [
            "Oops! You touched fiat currency - it's losing value!",
            "Fiat money is inflationary - stick to Bitcoin!",
            "Central banks print money endlessly - avoid fiat!",
            "Fiat loses purchasing power over time!",
            "Bitcoin is sound money - fiat is not!"
        ];
        
        this.doMessages = [
            "Great! You're practicing self-custody!",
            "Excellent! You're stacking sats regularly!",
            "Perfect! You're using cold storage!",
            "Smart! You're doing your own research!",
            "Awesome! You're avoiding emotional trading!",
            "Brilliant! You understand Bitcoin's scarcity!",
            "Outstanding! You're embracing decentralization!"
        ];
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupDifficultySelection();
        this.updateTip();
        this.updateStats();
        this.showMessage("Select difficulty and click 'Start Game' to begin!");
    }
    
    initSoundSystem() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    createSounds() {
        // Create simple sound effects using Web Audio API
        this.sounds = {
            sat: this.createTone(800, 0.1, 'sine'),
            fiat: this.createTone(200, 0.2, 'sawtooth'),
            good: this.createTone(600, 0.15, 'square'),
            levelUp: this.createTone(1000, 0.3, 'sine'),
            gameOver: this.createTone(150, 0.5, 'sawtooth'),
            pause: this.createTone(400, 0.1, 'triangle')
        };
    }
    
    createTone(frequency, duration, type) {
        return () => {
            if (!this.audioContext || !this.soundToggle.checked) return;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
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
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (this.direction.y === 0) {
                        this.nextDirection = {x: 0, y: -1};
                    }
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (this.direction.y === 0) {
                        this.nextDirection = {x: 0, y: 1};
                    }
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (this.direction.x === 0) {
                        this.nextDirection = {x: -1, y: 0};
                    }
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (this.direction.x === 0) {
                        this.nextDirection = {x: 1, y: 0};
                    }
                    break;
                case ' ':
                case 'p':
                case 'P':
                    this.togglePause();
                    break;
            }
        });
        
        // Touch controls for mobile
        let touchStartX = 0;
        let touchStartY = 0;
        
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            e.preventDefault();
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                // Horizontal swipe
                if (deltaX > 0 && this.direction.x === 0) {
                    this.nextDirection = {x: 1, y: 0};
                } else if (deltaX < 0 && this.direction.x === 0) {
                    this.nextDirection = {x: -1, y: 0};
                }
            } else {
                // Vertical swipe
                if (deltaY > 0 && this.direction.y === 0) {
                    this.nextDirection = {x: 0, y: 1};
                } else if (deltaY < 0 && this.direction.y === 0) {
                    this.nextDirection = {x: 0, y: -1};
                }
            }
        });
        
        // Button listeners
        this.startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        this.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });
        
        this.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    setupDifficultySelection() {
        this.difficultyButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove selected class from all buttons
                this.difficultyButtons.forEach(b => b.classList.remove('selected'));
                // Add selected class to clicked button
                btn.classList.add('selected');
                
                this.difficulty = btn.dataset.difficulty;
                this.currentDifficultyElement.textContent = this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1);
                
                this.showMessage(`${this.difficulty.charAt(0).toUpperCase() + this.difficulty.slice(1)} difficulty selected!`);
            });
        });
        
        // Default to normal difficulty
        this.difficultyButtons[1].click();
    }
    
    togglePause() {
        if (!this.gameRunning) return;
        
        this.gamePaused = !this.gamePaused;
        
        if (this.gamePaused) {
            this.playSound('pause');
            this.pauseBtn.textContent = 'Resume';
            this.showMessage('Game Paused - Press Space or P to resume');
        } else {
            this.pauseBtn.textContent = 'Pause';
            this.showMessage('Game Resumed!');
            this.gameLoop();
        }
    }
    
    startGame() {
        if (this.difficulty === '') {
            this.showMessage('Please select a difficulty level first!');
            return;
        }
        
        this.gameRunning = true;
        this.gamePaused = false;
        this.score = 0;
        this.level = 1;
        this.health = this.maxHealth;
        this.satsCollected = 0;
        this.goodPractices = 0;
        this.fiatHit = 0;
        
        // Set difficulty-based settings
        const settings = this.difficultySettings[this.difficulty];
        this.speed = settings.speed;
        this.speedIncrease = settings.speedIncrease;
        
        // Initialize snake
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        
        // Clear game objects
        this.sats = [];
        this.fiats = [];
        this.dos = [];
        
        // Update UI
        this.startBtn.classList.add('hidden');
        this.difficultySelector.classList.add('hidden');
        this.pauseBtn.classList.remove('hidden');
        this.pauseBtn.textContent = 'Pause';
        this.restartBtn.classList.add('hidden');
        this.showMessage("Game started! Use arrow keys or swipe to control the snake.");
        
        // Generate initial objects
        this.generateSat();
        this.generateFiat();
        this.generateDo();
        
        // Start game loop
        this.gameLoop();
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning || this.gamePaused) return;
        
        this.update();
        this.draw();
        
        setTimeout(() => {
            requestAnimationFrame(() => this.gameLoop());
        }, this.speed);
    }
    
    update() {
        // Update direction
        this.direction = {...this.nextDirection};
        
        // Move snake
        const head = {...this.snake[0]};
        head.x += this.direction.x;
        head.y += this.direction.y;
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver('Wall collision!');
            return;
        }
        
        // Check self collision
        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                this.gameOver('Self collision!');
                return;
            }
        }
        
        // Add new head
        this.snake.unshift(head);
        
        // Check sat collision
        let satEaten = false;
        this.sats = this.sats.filter(sat => {
            if (head.x === sat.x && head.y === sat.y) {
                this.score += 10;
                this.satsCollected++;
                this.health = Math.min(this.maxHealth, this.health + this.difficultySettings[this.difficulty].healthGain);
                satEaten = true;
                this.updateScore();
                this.updateStats();
                this.updateTip();
                this.playSound('sat');
                this.showMessage(`Sat collected! +10 points, +${this.difficultySettings[this.difficulty].healthGain} health`);
                return false;
            }
            return true;
        });
        
        // Check fiat collision
        this.fiats.forEach(fiat => {
            if (head.x === fiat.x && head.y === fiat.y) {
                this.health -= this.difficultySettings[this.difficulty].fiatDamage;
                this.fiatHit++;
                this.playSound('fiat');
                this.showMessage(this.getRandomMessage(this.fiatMessages));
                
                if (this.health <= 0) {
                    this.gameOver('Health depleted!');
                    return;
                }
            }
        });
        
        // Check do collision (safe passage)
        this.dos.forEach(doItem => {
            if (head.x === doItem.x && head.y === doItem.y) {
                this.score += 5; // Bonus for good practices
                this.goodPractices++;
                this.health = Math.min(this.maxHealth, this.health + 5);
                this.updateScore();
                this.updateStats();
                this.updateTip();
                this.playSound('good');
                this.showMessage("Good practice! +5 points, +5 health");
            }
        });
        
        // Remove tail if no sat eaten
        if (!satEaten) {
            this.snake.pop();
        }
        
        // Generate new objects
        if (this.sats.length === 0) {
            this.generateSat();
        }
        
        if (this.fiats.length === 0 && Math.random() < this.difficultySettings[this.difficulty].fiatSpawnRate) {
            this.generateFiat();
        }
        
        if (this.dos.length === 0) {
            this.generateDo();
        }
        
        // Level up based on health and score
        if (this.score > 0 && this.score % 50 === 0 && this.health >= 50) {
            this.levelUp();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0a0e14';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid (subtle)
        this.ctx.strokeStyle = '#1a2332';
        this.ctx.lineWidth = 0.5;
        for (let x = 0; x < this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.gridSize) {
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
        const sat = this.getRandomPosition();
        this.sats.push(sat);
    }
    
    generateFiat() {
        const fiat = this.getRandomPosition();
        this.fiats.push(fiat);
    }
    
    generateDo() {
        const doItem = this.getRandomPosition();
        this.dos.push(doItem);
    }
    
    getRandomPosition() {
        const maxX = Math.floor(this.canvas.width / this.gridSize);
        const maxY = Math.floor(this.canvas.height / this.gridSize);
        
        let position;
        do {
            position = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (this.isPositionOccupied(position));
        
        return position;
    }
    
    isPositionOccupied(pos) {
        // Check snake
        for (let segment of this.snake) {
            if (pos.x === segment.x && pos.y === segment.y) return true;
        }
        
        // Check sats
        for (let sat of this.sats) {
            if (pos.x === sat.x && pos.y === sat.y) return true;
        }
        
        // Check fiats
        for (let fiat of this.fiats) {
            if (pos.x === fiat.x && pos.y === fiat.y) return true;
        }
        
        // Check do's
        for (let doItem of this.dos) {
            if (pos.x === doItem.x && pos.y === doItem.y) return true;
        }
        
        return false;
    }
    
    levelUp() {
        this.level++;
        this.speed = Math.max(50, this.speed - this.speedIncrease);
        this.levelElement.textContent = this.level;
        this.playSound('levelUp');
        
        // Show level up message
        this.showMessage(`Level ${this.level}! Speed increased! Health: ${this.health}`);
    }
    
    gameOver(message) {
        this.gameRunning = false;
        this.gamePaused = false;
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('snakesats-best', this.bestScore);
            this.bestScoreElement.textContent = this.bestScore;
        }
        
        this.playSound('gameOver');
        
        // Update UI
        this.showMessage(`Game Over! ${message} Final Score: ${this.score} sats`);
        this.pauseBtn.classList.add('hidden');
        this.restartBtn.classList.remove('hidden');
        this.difficultySelector.classList.remove('hidden');
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
        this.currentScoreElement.textContent = this.score;
        this.healthElement.textContent = this.health;
    }
    
    updateStats() {
        this.snakeLengthElement.textContent = this.snake.length;
        this.satsCollectedElement.textContent = this.satsCollected;
        this.goodPracticesElement.textContent = this.goodPractices;
    }
    
    updateTip() {
        const tip = this.getRandomMessage(this.bitcoinTips);
        this.tipDisplay.textContent = tip;
    }
    
    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    showMessage(message) {
        this.gameMessage.textContent = message;
        
        // Clear message after 3 seconds
        setTimeout(() => {
            if (this.gameMessage.textContent === message) {
                this.gameMessage.textContent = '';
            }
        }, 3000);
    }
}

// Add fadeInOut animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeSats();
}); 
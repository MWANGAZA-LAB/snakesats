// SnakeSats Game - Bitcoin Education Game
class SnakeSats {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.bestScoreElement = document.getElementById('best-score');
        this.tipDisplay = document.getElementById('tip-display');
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.level = 1;
        this.bestScore = localStorage.getItem('snakesats-best') || 0;
        this.bestScoreElement.textContent = this.bestScore;
        
        // Game settings
        this.gridSize = 20;
        this.speed = 150;
        this.speedIncrease = 10;
        
        // Snake
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 0, y: 0};
        this.nextDirection = {x: 0, y: 0};
        
        // Game objects
        this.sats = [];
        this.donts = [];
        this.dos = [];
        
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
            "Verify, don't trust - always do your own research."
        ];
        
        this.dontMessages = [
            "Oops! You FOMO'd into a scam coin!",
            "Don't keep your coins on exchanges!",
            "Trading on emotions leads to losses!",
            "Avoid falling for get-rich-quick schemes!",
            "Don't invest without understanding the technology!"
        ];
        
        this.doMessages = [
            "Great! You're practicing self-custody!",
            "Excellent! You're stacking sats regularly!",
            "Perfect! You're using cold storage!",
            "Smart! You're doing your own research!",
            "Awesome! You're avoiding emotional trading!"
        ];
        
        // Initialize
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showStartScreen();
        this.updateTip();
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
            if (!this.gameRunning) return;
            
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
        document.getElementById('start-btn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.level = 1;
        this.speed = 150;
        
        // Initialize snake
        this.snake = [{x: 10, y: 10}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        
        // Clear game objects
        this.sats = [];
        this.donts = [];
        this.dos = [];
        
        // Hide start screen
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-overlay').classList.add('hidden');
        
        // Generate initial objects
        this.generateSat();
        this.generateDont();
        this.generateDo();
        
        // Start game loop
        this.gameLoop();
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop() {
        if (!this.gameRunning) return;
        
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
                satEaten = true;
                this.updateScore();
                this.updateTip();
                return false;
            }
            return true;
        });
        
        // Check don't collision
        this.donts.forEach(dont => {
            if (head.x === dont.x && head.y === dont.y) {
                this.gameOver(this.getRandomMessage(this.dontMessages));
                return;
            }
        });
        
        // Check do collision (safe passage)
        this.dos.forEach(doItem => {
            if (head.x === doItem.x && head.y === doItem.y) {
                this.score += 5; // Bonus for good practices
                this.updateScore();
                this.updateTip();
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
        
        if (this.donts.length === 0) {
            this.generateDont();
        }
        
        if (this.dos.length === 0) {
            this.generateDo();
        }
        
        // Level up
        if (this.score > 0 && this.score % 50 === 0) {
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
        
        // Draw don'ts (red skulls)
        this.donts.forEach(dont => {
            this.ctx.fillStyle = '#ff6b6b';
            this.ctx.fillRect(dont.x * this.gridSize, dont.y * this.gridSize, this.gridSize, this.gridSize);
            
            // Skull symbol
            this.ctx.fillStyle = '#0a0e14';
            this.ctx.font = '14px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('💀', dont.x * this.gridSize + this.gridSize / 2, dont.y * this.gridSize + this.gridSize / 2 + 4);
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
    }
    
    generateSat() {
        const sat = this.getRandomPosition();
        this.sats.push(sat);
    }
    
    generateDont() {
        const dont = this.getRandomPosition();
        this.donts.push(dont);
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
        
        // Check don'ts
        for (let dont of this.donts) {
            if (pos.x === dont.x && pos.y === dont.y) return true;
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
        
        // Show level up message
        this.showMessage(`Level ${this.level}! Speed increased!`);
    }
    
    gameOver(message) {
        this.gameRunning = false;
        
        // Update best score
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('snakesats-best', this.bestScore);
            this.bestScoreElement.textContent = this.bestScore;
        }
        
        // Show game over screen
        document.getElementById('overlay-title').textContent = 'Game Over!';
        document.getElementById('overlay-message').textContent = message;
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-level').textContent = this.level;
        document.getElementById('game-overlay').classList.remove('hidden');
    }
    
    updateScore() {
        this.scoreElement.textContent = this.score;
    }
    
    updateTip() {
        const tip = this.getRandomMessage(this.bitcoinTips);
        this.tipDisplay.textContent = tip;
    }
    
    getRandomMessage(messages) {
        return messages[Math.floor(Math.random() * messages.length)];
    }
    
    showMessage(message) {
        // Create temporary message display
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(247, 147, 26, 0.9);
            color: #0a0e14;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1000;
            animation: fadeInOut 2s ease-in-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 2000);
    }
    
    showStartScreen() {
        document.getElementById('start-screen').classList.remove('hidden');
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
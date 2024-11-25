class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setCanvasSize();
        
        // Base sizes that will scale with screen size
        this.baseCarWidth = this.canvas.width * 0.1; // 10% of canvas width
        this.baseCarHeight = this.baseCarWidth * 1.5; // Maintain aspect ratio
        
        this.car = {
            x: this.canvas.width / 2 - this.baseCarWidth / 2,
            y: this.canvas.height - this.baseCarHeight * 1.5,
            width: this.baseCarWidth,
            height: this.baseCarHeight,
            speed: this.canvas.width * 0.01 // Responsive speed
        };
        
        this.obstacles = [];
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.gameOver = false;
        this.animationId = null;
        this.keys = {};
        
        this.bindEvents();
        this.startButton = document.getElementById('startButton');
        this.gameOverScreen = document.getElementById('gameOverScreen');
        this.startButton.addEventListener('click', () => this.startGame());
        this.updateHighScore();
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }

    setCanvasSize() {
        // Get the game container dimensions
        const container = document.querySelector('.game-container');
        const maxWidth = Math.min(window.innerWidth * 0.9, 600); // Max width of 600px
        const maxHeight = window.innerHeight * 0.7; // 70% of viewport height
        
        // Set canvas size while maintaining aspect ratio
        this.canvas.width = maxWidth;
        this.canvas.height = maxHeight;
    }

    handleResize() {
        const oldWidth = this.canvas.width;
        const oldHeight = this.canvas.height;
        
        this.setCanvasSize();
        
        // Scale car position and size
        const scaleX = this.canvas.width / oldWidth;
        const scaleY = this.canvas.height / oldHeight;
        
        this.baseCarWidth = this.canvas.width * 0.1;
        this.baseCarHeight = this.baseCarWidth * 1.5;
        
        this.car.x *= scaleX;
        this.car.y = this.canvas.height - this.baseCarHeight * 1.5;
        this.car.width = this.baseCarWidth;
        this.car.height = this.baseCarHeight;
        this.car.speed = this.canvas.width * 0.01;
        
        // Scale obstacles
        this.obstacles = this.obstacles.map(obstacle => ({
            ...obstacle,
            x: obstacle.x * scaleX,
            y: obstacle.y * scaleY,
            width: this.baseCarWidth,
            height: this.baseCarHeight,
            speed: 3 + (this.score / 500)
        }));
    }

    bindEvents() {
        // Touch controls
        this.canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const centerX = window.innerWidth / 2;
            this.keys['ArrowLeft'] = touch.clientX < centerX;
            this.keys['ArrowRight'] = touch.clientX >= centerX;
            e.preventDefault();
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.keys['ArrowLeft'] = false;
            this.keys['ArrowRight'] = false;
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => this.keys[e.key] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key] = false);
    }

    startGame() {
        this.gameOver = false;
        this.score = 0;
        this.obstacles = [];
        this.gameOverScreen.style.display = 'none';
        this.updateScore();
        this.gameLoop();
        this.startButton.style.display = 'none';
    }

    createObstacle() {
        if (Math.random() < 0.02) {
            const obstacle = {
                x: Math.random() * (this.canvas.width - this.baseCarWidth),
                y: -this.baseCarHeight,
                width: this.baseCarWidth,
                height: this.baseCarHeight,
                speed: 3 + (this.score / 500)
            };
            this.obstacles.push(obstacle);
        }
    }

    updateScore() {
        document.getElementById('scoreValue').textContent = this.score;
        document.getElementById('finalScore').textContent = this.score;
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
            this.updateHighScore();
        }
    }

    updateHighScore() {
        document.getElementById('highScoreValue').textContent = this.highScore;
    }

    movePlayer() {
        if (this.keys['ArrowLeft'] && this.car.x > 0) {
            this.car.x -= this.car.speed;
        }
        if (this.keys['ArrowRight'] && this.car.x < this.canvas.width - this.car.width) {
            this.car.x += this.car.speed;
        }
    }

    updateObstacles() {
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obstacle = this.obstacles[i];
            obstacle.y += obstacle.speed;

            if (this.checkCollision(this.car, obstacle)) {
                this.gameOver = true;
                this.startButton.style.display = 'block';
                this.startButton.textContent = 'Play Again';
                this.gameOverScreen.style.display = 'block';
                return;
            }

            if (obstacle.y > this.canvas.height) {
                this.obstacles.splice(i, 1);
                this.score += 10;
                this.updateScore();
            }
        }
    }

    checkCollision(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    }

    drawCar(x, y, width, height, color) {
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y, width, height, width * 0.1);
        this.ctx.fill();
        
        // Windows
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(x + width * 0.1, y + height * 0.15, width * 0.8, height * 0.3);
        
        // Wheels
        const wheelWidth = width * 0.1;
        const wheelHeight = height * 0.2;
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x - wheelWidth * 0.2, y + height * 0.1, wheelWidth, wheelHeight);
        this.ctx.fillRect(x + width - wheelWidth * 0.8, y + height * 0.1, wheelWidth, wheelHeight);
        this.ctx.fillRect(x - wheelWidth * 0.2, y + height * 0.7, wheelWidth, wheelHeight);
        this.ctx.fillRect(x + width - wheelWidth * 0.8, y + height * 0.7, wheelWidth, wheelHeight);
    }

    draw() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#3498db');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.strokeStyle = '#fff';
        this.ctx.setLineDash([this.canvas.height * 0.03, this.canvas.height * 0.03]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        
        this.drawCar(this.car.x, this.car.y, this.car.width, this.car.height, '#e74c3c');
        
        this.obstacles.forEach(obstacle => {
            this.drawCar(obstacle.x, obstacle.y, obstacle.width, obstacle.height, '#2ecc71');
        });
    }

    gameLoop() {
        if (!this.gameOver) {
            this.createObstacle();
            this.movePlayer();
            this.updateObstacles();
            this.draw();
            this.animationId = requestAnimationFrame(() => this.gameLoop());
        } else {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Initialize the game
const game = new Game();
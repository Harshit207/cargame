const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const carWidth = 50;
const carHeight = 100;
let carX = canvas.width / 2 - carWidth / 2;
let carY = canvas.height - carHeight - 10;
const carSpeed = 5;

let obstacles = [];
const obstacleWidth = 50;
const obstacleHeight = 100;
const obstacleSpeed = 5;
let gameOver = false;

// Handle user input
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft' && carX > 0) {
        carX -= carSpeed;
    } else if (event.key === 'ArrowRight' && carX < canvas.width - carWidth) {
        carX += carSpeed;
    }
});

// Game loop
function gameLoop() {
    if (!gameOver) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }
}

// Update game state
function update() {
    // Update obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].y += obstacleSpeed;
        if (obstacles[i].y > canvas.height) {
            obstacles.splice(i, 1);
            i--;
        }
    }

    // Check for collisions
    for (let obstacle of obstacles) {
        if (carX < obstacle.x + obstacleWidth &&
            carX + carWidth > obstacle.x &&
            carY < obstacle.y + obstacleHeight &&
            carY + carHeight > obstacle.y) {
            gameOver = true;
            alert('Game Over!');
        }
    }

    // Add new obstacles
    if (Math.random() < 0.02) {
        const obstacleX = Math.random() * (canvas.width - obstacleWidth);
        obstacles.push({ x: obstacleX, y: -obstacleHeight });
    }
}

// Draw game state
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw car
    context.fillStyle = 'red';
    context.fillRect(carX, carY, carWidth, carHeight);

    // Draw obstacles
    context.fillStyle = 'blue';
    for (let obstacle of obstacles) {
        context.fillRect(obstacle.x, obstacle.y, obstacleWidth, obstacleHeight);
    }
}

// Start the game
gameLoop();

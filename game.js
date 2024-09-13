// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Canvas dimensions
canvas.width = 400;
canvas.height = 600;

// Set canvas background color
ctx.fillStyle = 'black'; // Background color
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Car properties
const carWidth = 50;
const carHeight = 100;
let carX = canvas.width / 2 - carWidth / 2;
const carY = canvas.height - carHeight - 10;

// Other car (enemy) properties
let enemyX = Math.random() * (canvas.width - carWidth);
let enemyY = 0 - carHeight;
const enemySpeed = 4;

// Key press states
let leftPressed = false;
let rightPressed = false;

// Car movement speed
const carSpeed = 5;

// Event listeners for key presses
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === "ArrowLeft") {
        leftPressed = true;
    } else if (e.key === "ArrowRight") {
        rightPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowLeft") {
        leftPressed = false;
    } else if (e.key === "ArrowRight") {
        rightPressed = false;
    }
}

// Score variable
let score = 0;

// Update game logic
function update() {
    // Move player car
    if (leftPressed && carX > 0) {
        carX -= carSpeed;
    }
    if (rightPressed && carX < canvas.width - carWidth) {
        carX += carSpeed;
    }

    // Move enemy car
    enemyY += enemySpeed;
    if (enemyY > canvas.height) {
        enemyY = 0 - carHeight;
        enemyX = Math.random() * (canvas.width - carWidth);
        score += 1; // Increment score when enemy passes
    }

    // Collision detection
    if (carX < enemyX + carWidth &&
        carX + carWidth > enemyX &&
        carY < enemyY + carHeight &&
        carY + carHeight > enemyY) {
        alert("Game Over! Your score: " + score);
        document.location.reload();
    }
}

// Draw the game scene
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw canvas background
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player car
    ctx.fillStyle = 'blue';
    ctx.fillRect(carX, carY, carWidth, carHeight);

    // Draw enemy car
    ctx.fillStyle = 'red';
    ctx.fillRect(enemyX, enemyY, carWidth, carHeight);

    // Draw score
    ctx.font = "20px Arial";
    ctx.fillStyle = "white"; // Ensure text color is white
    ctx.fillText("Score: " + score, 10, 30);
}

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();

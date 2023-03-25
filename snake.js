const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const tileCount = canvas.width / gridSize;
const delay = 100;
let snake = [];
let direction = { x: 1, y: 0 };
let apple = {};
let currentScore = 0;
let topScore = 0;
let deathCount = 0;
let gameInterval;

let speed = 100;

function init() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
    ];
    direction = { x: 1, y: 0 };
    apple = spawnApple();
    currentScore = 0;
    updateScore();
    clearInterval(gameInterval);
    speed = 100; // Set the initial speed
    gameInterval = setInterval(game, speed);
}

function game() {
    updateSnake();
    checkCollision();
    checkApple();
    draw();
}

function updateSnake() {
    const newX = snake[0].x + direction.x;
    const newY = snake[0].y + direction.y;
    snake.unshift({ x: newX, y: newY });
    snake.pop();
}

function checkCollision() {
    // Check collision with the wall
    if (snake[0].x < 0 || snake[0].x >= canvas.width / gridSize || snake[0].y < 0 || snake[0].y >= canvas.height / gridSize) {
        deathCount++;
        updateDeathCount();
        init();
    }
    
    // Check collision with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            deathCount++;
            updateDeathCount();
            init();
        }
    }
}

function checkApple() {
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
        snake.push({ x: apple.x, y: apple.y });
        currentScore++;
        if (currentScore > topScore) {
            topScore = currentScore;
        }
        updateScore();
        apple = spawnApple();

        clearInterval(gameInterval); // Clear the existing interval
        speed = 100 - Math.min(currentScore * 5, 60); // Increase speed based on the current score
        gameInterval = setInterval(game, speed); // Set the new interval with the updated speed
    }
}

function draw() {
    ctx.fillStyle = "#181e23";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = "#50c878";
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            });

    // Draw apple
    ctx.fillStyle = "#c8505e";
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize - 1, gridSize - 1);
}

function spawnApple() {
    return {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount),
    };
}

function updateScore() {
    const currentScoreElement = document.getElementById("current-score");
    const topScoreElement = document.getElementById("top-score");
    currentScoreElement.textContent = `Current score: ${currentScore}`;
    topScoreElement.textContent = `Top score: ${topScore}`;
}

function updateDeathCount() {
    const deathCountElement = document.getElementById("death-count");
    deathCountElement.textContent = `Deaths: ${deathCount}`;
}

// Updated keydown event listener
document.addEventListener("keydown", event => {
    const keyToDirection = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
    };

    const newDirection = keyToDirection[event.key];

    if (newDirection &&
        !(newDirection.x === -direction.x && newDirection.y === direction.y) &&
        !(newDirection.x === direction.x && newDirection.y === -direction.y)) {
        direction = newDirection;
    }
});

init();

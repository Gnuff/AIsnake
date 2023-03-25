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
    gameInterval = setInterval(game, delay);
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
    }
}

function draw() {
    ctx.fillStyle = "#1c211d";
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

document.addEventListener("keydown", event => {
    const keyToDirection = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
    };

    const newDirection = keyToDirection[event.key];

    if (newDirection) {
        direction = newDirection;
    }
});

init();


const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = 400;

const resolution = 20;
const tileSize = canvas.width / resolution;

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let velocity = { x: 1, y: 0 };

let speed = 150;
let currentScore = 0;
let topScore = 0;
let deathCounter = 0;
const deathCounterElement = document.getElementById('death-counter');
const currentScoreCounter = document.getElementById('current-score');
const topScoreCounter = document.getElementById('top-score');

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && velocity.y === 0) velocity = { x: 0, y: -1 };
    if (event.key === 'ArrowDown' && velocity.y === 0) velocity = { x: 0, y: 1 };
    if (event.key === 'ArrowLeft' && velocity.x === 0) velocity = { x: -1, y: 0 };
    if (event.key === 'ArrowRight' && velocity.x === 0) velocity = { x: 1, y: 0 };
});

function updateCurrentScore() {
    currentScoreCounter.textContent = `Current score: ${currentScore}`;
}

function updateTopScore() {
    topScoreCounter.textContent = `Top score: ${topScore}`;
}

function loop() {
    setTimeout(() => {
        requestAnimationFrame(loop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.push({ x: snake[0].x + velocity.x, y: snake[0].y + velocity.y });

        if (snake[0].x === apple.x && snake[0].y === apple.y) {
            apple = { x: Math.floor(Math.random() * resolution), y: Math.floor(Math.random() * resolution) };
            currentScore++;
            updateCurrentScore();
        } else {
            snake.shift();
        }

        if (snake[0].x < 0 || snake[0].x >= resolution || snake[0].y < 0 || snake[0].y >= resolution) {
            snake = [{ x: 10, y: 10 }];
            velocity = { x: 1, y: 0 };
            if (currentScore > topScore) {
                topScore = currentScore;
                updateTopScore();
            }
            currentScore = 0;
            updateCurrentScore();
        }
        
        if (snake.collidedWithWall() || snake.collidedWithItself()) {
        snake.reset();
        apple.generate(snake);
        // Increment the death counter and update the display
        deathCounter++;
        deathCounterElement.textContent = `Deaths: ${deathCounter}`;
        } else {
            snake.move();
        }
        
        
        ctx.fillStyle = '#c82e50';
        ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

        ctx.fillStyle = '#50c878';
        for (const part of snake) {
            ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
        }
    }, speed);
}

loop();

window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
});


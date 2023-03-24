const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');
canvas.width = canvas.height = 400;

const resolution = 20;
const tileSize = canvas.width / resolution;

let snake = [{ x: 10, y: 10 }];
let apple = { x: 15, y: 15 };
let velocity = { x: 1, y: 0 };

let speed = 150; // Adjust this value to control the snake's speed. Higher values make the snake slower.

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' && velocity.y === 0) velocity = { x: 0, y: -1 };
    if (event.key === 'ArrowDown' && velocity.y === 0) velocity = { x: 0, y: 1 };
    if (event.key === 'ArrowLeft' && velocity.x === 0) velocity = { x: -1, y: 0 };
    if (event.key === 'ArrowRight' && velocity.x === 0) velocity = { x: 1, y: 0 };
});

function loop() {
    setTimeout(() => {
        requestAnimationFrame(loop);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.push({ x: snake[0].x + velocity.x, y: snake[0].y + velocity.y });

        if (snake[0].x === apple.x && snake[0].y === apple.y) {
            apple = { x: Math.floor(Math.random() * resolution), y: Math.floor(Math.random() * resolution) };
        } else {
            snake.shift();
        }

        if (snake[0].x < 0 || snake[0].x >= resolution || snake[0].y < 0 || snake[0].y >= resolution) {
            snake = [{ x: 10, y: 10 }];
            velocity = { x: 1, y: 0 };
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x * tileSize, apple.y * tileSize, tileSize, tileSize);

        ctx.fillStyle = 'lime';
        for (const part of snake) {
            ctx.fillRect(part.x * tileSize, part.y * tileSize, tileSize, tileSize);
        }
    }, speed);
}

loop();

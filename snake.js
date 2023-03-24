const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

const resolution = 20;
canvas.width = 600;
canvas.height = 600;

class Snake {
    constructor() {
        this.snakeArray = [
            { x: 10 * resolution, y: 10 * resolution }
        ];
        this.direction = 'Right';
        this.newDirection = 'Right';
        this.growSnake = false;
    }

    updateDirection(newDirection) {
        this.newDirection = newDirection;
    }

    move() {
        const head = { ...this.snakeArray[0] };

        if (this.direction === 'Up') head.y -= resolution;
        if (this.direction === 'Down') head.y += resolution;
        if (this.direction === 'Left') head.x -= resolution;
        if (this.direction === 'Right') head.x += resolution;

        if (this.growSnake) {
            this.growSnake = false;
        } else {
            this.snakeArray.pop();
        }

        this.snakeArray.unshift(head);
        this.direction = this.newDirection;
    }

    draw() {
        ctx.fillStyle = '#34854b';
        for (const cell of this.snakeArray) {
            ctx.fillRect(cell.x, cell.y, resolution, resolution);
        }
    }

    collidedWithWall() {
        const head = this.snakeArray[0];
        return (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= canvas.width ||
            head.y >= canvas.height
        );
    }

    collidedWithItself() {
        const head = this.snakeArray[0];
        for (const cell of this.snakeArray.slice(1)) {
            if (head.x === cell.x && head.y === cell.y) {
                return true;
            }
        }
        return false;
    }

    reset() {
        this.snakeArray = [
            { x: 10 * resolution, y: 10 * resolution }
        ];
        this.direction = 'Right';
        this.newDirection = 'Right';
    }

    eatApple(apple) {
        if (
            this.snakeArray[0].x === apple.position.x &&
            this.snakeArray[0].y === apple.position.y
        ) {
            this.growSnake = true;
            return true;
        }
        return false;
    }
}

class Apple {
    constructor(snake) {
        this.position = { x: 0, y: 0 };
        this.generate(snake);
    }

    generate(snake) {
        let newPosition;

        do {
            newPosition = {
                x: Math.floor(Math.random() * (canvas.width / resolution)) * resolution,
                y: Math.floor(Math.random() * (canvas.height / resolution)) * resolution
            };
        } while (snake.snakeArray.some(cell => cell.x === newPosition.x && cell.y === newPosition.y));

        this.position = newPosition;
    }

    draw() {
        ctx.fillStyle = '#e63946';
        ctx.fillRect(this.position.x, this.position.y, resolution, resolution);
    }
}

const snake = new Snake();
const apple = new Apple(snake);
let score = 0;
let topScore = 0;
const currentScoreElement = document.getElementById('current-score');
const topScoreElement = document.getElementById('top-score');
let deathCounter = 0;
const deathCounterElement = document.getElementById('death-counter');

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.draw();
    snake.move();
    apple.draw();

        if (snake.collidedWithWall() || snake.collidedWithItself()) {
        snake.reset();
        apple.generate(snake);
        score = 0;
        currentScoreElement.textContent = `Current score: ${score}`;
        // Increment the death counter and update the display
        deathCounter++;
        deathCounterElement.textContent = `Deaths: ${deathCounter}`;
    } else {
        snake.move();
    }

    if (snake.eatApple(apple)) {
        apple.generate(snake);
        score++;
        currentScoreElement.textContent = `Current score: ${score}`;

        if (score > topScore) {
            topScore = score;
            topScoreElement.textContent = `Top score: ${topScore}`;
        }
    }

    setTimeout(gameLoop, 200);
}

gameLoop();

window.addEventListener('keydown', (event) => {
    const direction = event.key.replace('Arrow', '');
    const opposites = {
        Up: 'Down',
        Down: 'Up',
        Left: 'Right',
        Right: 'Left'
    };

    if (Object.keys(opposites).includes(direction) && direction !== opposites[snake.direction]) {
        snake.updateDirection(direction);
    }
});

window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
});


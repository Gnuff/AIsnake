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

function playChompSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  // Create a noise buffer
  const bufferSize = audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  // Create a noise source and set the buffer
  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;

  // Create a lowpass filter for the noise
  const noiseFilter = audioContext.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(600, audioContext.currentTime);
  noiseFilter.Q.setValueAtTime(1, audioContext.currentTime);

  // Connect the noise source to the filter
  noiseSource.connect(noiseFilter);

  // Create a gain node for the noise
  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.5, audioContext.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

  // Connect the filter to the noise gain
  noiseFilter.connect(noiseGain);

  // Create an oscillator for the chomp sound
  const oscillator = audioContext.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(160, audioContext.currentTime);

  // Create a gain node for the oscillator
  const oscGain = audioContext.createGain();
  oscGain.gain.setValueAtTime(1, audioContext.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1);

  // Connect the oscillator to the gain node
  oscillator.connect(oscGain);

  // Connect both the noise gain and oscillator gain to the destination
  noiseGain.connect(audioContext.destination);
  oscGain.connect(audioContext.destination);

  // Start the noise source and oscillator
  noiseSource.start();
  oscillator.start();

  // Stop the noise source and oscillator after 1 second
  noiseSource.stop(audioContext.currentTime + 1);
  oscillator.stop(audioContext.currentTime + 1);
}


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
        
        // Play the chomp sound
        playChompSound();

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

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
  110, 138.59, 164.81, 174.61, 164.81, 138.59, 110,
  174.61, 207.65, 246.94, 261.63, 246.94, 207.65, 174.61
];

let startTime = audioContext.currentTime + 0.1;
let scheduledNotes = [];
let isMusicPlaying = false; // Add a flag to track if the music is playing

function scheduleNote(note, time) {
  // ...
}

function playNotes() {
  // ...
}

function stopMusic() {
  // ...
}

function loop() {
  if (currentScore === 2 && !isMusicPlaying) {
    isMusicPlaying = true;
    playNotes();
  } else if (currentScore > 2) {
    playNotes();
  } else if (currentScore === 0 && isMusicPlaying) {
    isMusicPlaying = false;
    stopMusic();
  }

  setTimeout(loop, 100);
}

loop();

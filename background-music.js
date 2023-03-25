const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const notes = [
  110, 138.59, 164.81, 174.61, 164.81, 138.59, 110, 174.61, 207.65, 246.94,
  261.63, 246.94, 207.65, 174.61, 130.81, 164.81
];
let startTime = null;
let scheduledNotes = [];
let timeoutId = null;

// Load the drum sample buffer
const drumSampleBuffer = audioContext.createBuffer(1, 44100, 44100);
const drumSampleData = drumSampleBuffer.getChannelData(0);
for (let i = 0; i < 44100; i++) {
  drumSampleData[i] = Math.random() * 2 - 1;
}

function scheduleNote(note, time) {
  const source = audioContext.createBufferSource();
  source.buffer = drumSampleBuffer;
  source.playbackRate.value = note / 440;

  const gain = audioContext.createGain();
  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

  source.connect(gain);
  gain.connect(audioContext.destination);

  source.start(time);
  source.stop(time + 0.5);

  scheduledNotes.push({ source, time, duration: 0.5 });
}

function playNotes() {
  const speedFactor = 1 - Math.min(currentScore / 25, 0.7);
  const noteDuration = 0.5 * speedFactor;

  notes.forEach((note, index) => {
    const time = startTime + index * noteDuration;
    scheduleNote(note, time);
  });

  startTime += notes.length * noteDuration;
}

function loop() {
  if (currentScore >= 2) {
    if (startTime === null) {
      startTime = audioContext.currentTime + 0.1;
      playNotes();
    }

    timeoutId = setTimeout(loop, (notes.length * 0.5 - 0.1) * 1000);
  } else {
    stopMusic();
  }
}

function stopMusic() {
  scheduledNotes.forEach(({ source, time, duration }) => {
    source.stop(audioContext.currentTime);
  });
  scheduledNotes = [];
  startTime = null;
  clearTimeout(timeoutId);
}

window.addEventListener('resetMusic', () => {
  stopMusic();
});

loop();

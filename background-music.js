const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const notes = [  261.63, 293.66, 329.63, 392, 440, 493.88, 523.25, 587.33, 659.25];

let startTime = null;
let scheduledNotes = [];
let timeoutId = null;

function scheduleNote(note, time) {
  const osc = audioContext.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = note;

  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);

  const duration = 0.5;
  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.start(time);
  osc.stop(time + duration);

  scheduledNotes.push({ osc, time, duration });
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
  scheduledNotes.forEach(({ osc, time, duration }) => {
    osc.stop(audioContext.currentTime);
  });
  scheduledNotes = [];
  startTime = null;
  clearTimeout(timeoutId);
}

window.addEventListener('resetMusic', () => {
  stopMusic();
});

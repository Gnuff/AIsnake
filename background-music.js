const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playDrumSample(time) {
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(150, time);
  oscillator.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);

  gain.gain.setValueAtTime(1, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(time);
  oscillator.stop(time + 0.5);
}

const notes = [  110, 138.59, 164.81, 174.61, 164.81, 138.59, 110,  174.61, 207.65, 246.94, 261.63, 246.94, 207.65, 174.61,  130.81, 164.81, 196, 207.65, 196, 164.81, 130.81,  207.65, 246.94, 293.66, 311.13, 293.66, 246.94, 207.65];

let startTime = audioContext.currentTime + 0.1;
let scheduledNotes = [];
let timeoutId;

function scheduleNote(note, time) {
  const osc = audioContext.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = note;

  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);

  const duration = 0.5;
  gain.gain.setValueAtTime(0.4, time);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

  osc.start(time);
  osc.stop(time + duration);

  scheduledNotes.push({osc, time, duration});

  playDrumSample(time);
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

function startMusic() {
  scheduledNotes = [];
  playNotes();
  timeoutId = setTimeout(startMusic, (notes.length * 0.5 - 0.1) * 1000);
}

function stopMusic() {
  scheduledNotes.forEach(({osc, time, duration}) => {
    osc.stop(audioContext.currentTime);
  });
  clearTimeout(timeoutId);
}

function resetMusic() {
  if (currentScore === 0) {
    stopMusic();
  } else if (currentScore === 2) {
    startMusic();
  }
}

window.addEventListener('resetMusic', resetMusic);

startMusic();

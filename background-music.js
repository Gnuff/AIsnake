const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
  110, 138.59, 164.81, 174.61, 164.81, 138.59, 110,
  174.61, 207.65, 246.94, 261.63, 246.94, 207.65, 174.61,
  130.81, 164.81, 196, 207.65, 196, 164.81, 130.81,
  207.65, 246.94, 293.66, 311.13, 293.66, 246.94, 207.65
];

let startTime = audioContext.currentTime + 0.1;
let scheduledNotes = [];

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

  // Add the oscillator to the scheduledNotes array
  scheduledNotes.push({ oscillator: osc, endTime: time + duration });
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

function stopMusic() {
  scheduledNotes.forEach(note => {
    note.oscillator.stop(0);
  });
  scheduledNotes = [];
}

function loop() {
  if (currentScore === 2) {
    playNotes();
  }

  if (currentScore === 0) {
    stopMusic();
  }

  setTimeout(loop, notes.length * 0.5 * 1000);
}

loop();

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const notes = [
  110, 138.59, 164.81, 174.61, 164.81, 138.59, 110,
  174.61, 207.65, 246.94, 261.63, 246.94, 207.65, 174.61
];

let startTime = audioContext.currentTime + 0.1;
let scheduledNotes = [];
let isMusicPlaying = false;

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
  const speedFactor = 1 - Math.min((currentScore - 2) / 25, 0.7);
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
  if (currentScore === 2 && !isMusicPlaying) {
    isMusicPlaying = true;
    playNotes();
  } else if (currentScore > 2) {
    if (!isMusicPlaying) {
      isMusicPlaying = true;
      playNotes();
    }
  } else if (currentScore === 0 && isMusicPlaying) {
    isMusicPlaying = false;
    stopMusic();
  }

  // Remove finished notes from the scheduledNotes array
  scheduledNotes = scheduledNotes.filter(note => note.endTime > audioContext.currentTime);

  setTimeout(loop, 100);
}

loop();

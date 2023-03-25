const audioContext = new (window.AudioContext || window.webkitAudioContext)();

async function loadDrumSample() {
  const response = await fetch('https://sampleswap.org/samples-ghost/DRUMS%20(SINGLE%20HITS)/Kicks/22[kb]909bd.aif.mp3');
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

function playDrumSample(audioBuffer, time) {
  const drumSource = audioContext.createBufferSource();
  drumSource.buffer = audioBuffer;
  drumSource.connect(audioContext.destination);
  drumSource.start(time);
}

const notes = [
  110, 138.59, 164.81, 174.61, 164.81, 138.59, 110,
  174.61, 207.65, 246.94, 261.63, 246.94, 207.65, 174.61,
  130.81, 164.81, 196, 207.65, 196, 164.81, 130.81,
  207.65, 246.94, 293.66, 311.13, 293.66, 246.94, 207.65
];

let startTime = audioContext.currentTime + 0.1;

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

  playDrumSample(drumBuffer, time);
}

function playNotes(currentScore) {
  const speedFactor = 1 - Math.min(currentScore / 50, 0.7);
  const noteDuration = 0.5 * speedFactor;

  notes.forEach((note, index) => {
    const time = startTime + index * noteDuration;
    scheduleNote(note, time);
  });

  startTime += notes.length * noteDuration;
}

// Add currentScore as an argument to the loop function
function loop(currentScore) {
  playNotes(currentScore);
  setTimeout(() => loop(currentScore), notes.length * 0.5 * 1000);
}

// Export the loop function
export { loop };

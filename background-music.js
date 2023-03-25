const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function createOscillator(frequency, type) {
  const oscillator = audioContext.createOscillator();
  oscillator.type = type || 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  return oscillator;
}

function createGainNode() {
  const gainNode = audioContext.createGain();
  gainNode.gain.setValueAtTime(0, audioContext.currentTime);
  return gainNode;
}

function playNote(oscillator, gainNode, startTime, duration) {
  gainNode.gain.setValueAtTime(0, startTime);
  gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration - 0.01);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

function playMelody() {
  const notes = [
    110, 138.59, 164.81, 174.61, 164.81, 138.59, 110,
    174.61, 207.65, 246.94, 261.63, 246.94, 207.65, 174.61,
  ];
  const noteDuration = 0.3;
  const startTime = audioContext.currentTime;

  notes.forEach((note, index) => {
    const oscillator = createOscillator(note);
    const gainNode = createGainNode();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const noteStartTime = startTime + noteDuration * index;
    playNote(oscillator, gainNode, noteStartTime, noteDuration);
  });

  setTimeout(playMelody, notes.length * noteDuration * 1000);
}

playMelody();

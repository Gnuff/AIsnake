const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playNote(frequency, startTime, duration) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(1, startTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start(startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  oscillator.stop(startTime + duration);
}

function playMelody() {
  const notes = [220, 293.66, 329.63, 246.94, 196, 174.61];
  const duration = 0.5;

  let startTime = audioContext.currentTime;

  for (let i = 0; i < notes.length; i++) {
    playNote(notes[i], startTime + i * duration, duration);
  }

  setTimeout(playMelody, notes.length * duration * 1000);
}

playMelody();

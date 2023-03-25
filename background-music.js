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

  setTimeout(loop, 100);
}

loop();

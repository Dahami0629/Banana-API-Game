const menuBtn = document.getElementById('menuBtn');
    const menuModal = document.getElementById('menuModal');
    const closeMenuBtn = document.getElementById('closeMenuBtn');

    const leaderboardBtn = document.getElementById('leaderboardBtn');
    const leaderboardModal = document.getElementById('leaderboardModal');
    const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');

    const instructionsBtn = document.getElementById('instructionsBtn');
    const instructionsModal = document.getElementById('instructionsModal');
    const closeInstructionsBtn = document.getElementById('closeInstructionsBtn');

    const startBtn = document.getElementById('startBtn');
    const loadingBar = document.getElementById('loadingBar');
    const loadingProgress = document.getElementById('loadingProgress');

    const muteBtn = document.getElementById('muteBtn');
    const backgroundMusic = document.getElementById('backgroundMusic');

    menuBtn.addEventListener('click', function() {
      menuModal.style.display = 'block';
    });

    closeMenuBtn.addEventListener('click', function() {
      menuModal.style.display = 'none';
    });

    leaderboardBtn.addEventListener('click', function() {
      leaderboardModal.style.display = 'block';
      menuModal.style.display = 'none';
    });

    closeLeaderboardBtn.addEventListener('click', function() {
      leaderboardModal.style.display = 'none';
    });

    instructionsBtn.addEventListener('click', function() {
      instructionsModal.style.display = 'block';
      menuModal.style.display = 'none';
    });

    closeInstructionsBtn.addEventListener('click', function() {
      instructionsModal.style.display = 'none';
    });

    startBtn.addEventListener('click', function() {
      loadingBar.style.display = 'flex';
      document.querySelector('.buttons').style.display = 'none';

      let progress = 0;
      let loadingInterval = setInterval(function() {
        progress += 1;
        loadingProgress.style.width = progress + '%';
        if (progress >= 100) {
          clearInterval(loadingInterval);
          window.location.href = "SignupPage.html"; 
        }
      }, 30);
    });

   // const backgroundMusic = document.getElementById('backgroundMusic');

document.body.addEventListener('click', function() {
  if (backgroundMusic.paused) {
    backgroundMusic.play().catch(error => {
      console.log("Autoplay blocked:", error);
    });
  }
});


    muteBtn.addEventListener('click', function() {
      if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        muteBtn.textContent = "Mute";
      } else {
        backgroundMusic.muted = true;
        muteBtn.textContent = "Unmute";
      }
    });


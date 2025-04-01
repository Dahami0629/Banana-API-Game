document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("menuBtn");
  const menuModal = document.getElementById("menuModal");
  const closeMenuBtn = document.getElementById("closeMenuBtn");

  const instructionsBtn = document.getElementById("instructionsBtn");
  const instructionsModal = document.getElementById("instructionsModal");
  const closeInstructionsBtn = document.getElementById("closeInstructionsBtn");

  const startBtn = document.getElementById("startBtn");
  const loadingBar = document.getElementById("loadingBar");
  const loadingProgress = document.getElementById("loadingProgress");

  const muteBtn = document.getElementById("muteBtn");
  const backgroundMusic = document.getElementById("backgroundMusic");

    // cookies
    function setCookie(name, value, days) {
      let expires = "";
      if (days) {
        let date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + ";" + expires + "; path=/";
    }
  
    function getCookie(name) {
      let nameEQ = name + "=";
      let cookiesArr = document.cookie.split(";");
      for (let i = 0; i < cookiesArr.length; i++) {
        let cookie = cookiesArr[i].trim();
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length);
      }
      return null;
    }
  
    function deleteCookie(name) {
      document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  
    let savedMuteSetting = getCookie("mute");
    if (savedMuteSetting === "true") {
      backgroundMusic.muted = true;
      muteBtn.textContent = "Unmute";
    }

    menuBtn.addEventListener("click", () => (menuModal.style.display = "block"));
    closeMenuBtn.addEventListener("click", () => (menuModal.style.display = "none"));

    instructionsBtn.addEventListener("click", () => {
      instructionsModal.style.display = "block";
      menuModal.style.display = "none";
    });
    closeInstructionsBtn.addEventListener("click", () => (instructionsModal.style.display = "none"));

    startBtn.addEventListener("click", () => {
      loadingBar.style.display = "flex";
      document.querySelector(".buttons").style.display = "none";
  
      let progress = 0;
      let loadingInterval = setInterval(() => {
        progress += 1;
        loadingProgress.style.width = progress + "%";
        if (progress >= 100) {
          clearInterval(loadingInterval);
          window.location.href = "../html/GamePage.html";
        }
      }, 30);
    });
    
    document.addEventListener("click", () => {
      if (backgroundMusic.paused) {
        backgroundMusic.play().catch((error) => {
          console.log("Autoplay blocked:", error);
        });
      }
    });
    
    muteBtn.addEventListener("click", () => {
      if (backgroundMusic.muted) {
        backgroundMusic.muted = false;
        muteBtn.textContent = "Mute";
        setCookie("mute", "false", 7);
      } else {
        backgroundMusic.muted = true;
        muteBtn.textContent = "Unmute";
        setCookie("mute", "true", 7);
      }
    });

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn.addEventListener("click", logout);
  
    function logout() {
      localStorage.clear();
      deleteCookie("mute");
  
      if (firebase && firebase.auth) {
        firebase.auth().signOut()
          .then(() => {
            console.log("✅ User signed out successfully.");
            window.location.href = "../html/index.html";
          })
          .catch((error) => console.error("❌ Error signing out:", error));
      } else {
        console.error("Firebase is not initialized.");
      }
    }
  });

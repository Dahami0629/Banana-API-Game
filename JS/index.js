const muteBtn = document.getElementById("muteBtn");
  const backgroundMusic = document.getElementById("backgroundMusic");

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

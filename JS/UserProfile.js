function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
  }

  function saveProfile() {
    const nameInput = document.getElementById('editName').value;
    const emailInput = document.getElementById('editEmail').value;
    const avatarInput = document.getElementById('editAvatar').files[0];

    if (nameInput) document.getElementById('profileName').innerText = nameInput;
    if (emailInput) document.getElementById('profileEmail').innerText = emailInput;

    if (avatarInput) {
      const reader = new FileReader();
      reader.onload = function (e) {
        document.getElementById('profileAvatar').src = e.target.result;
      };
      reader.readAsDataURL(avatarInput);
    }

    switchTab('profileTab');
  }

  function logout() {
    alert("Logging out...");
    window.location.href = "LandingPage.html";
  }
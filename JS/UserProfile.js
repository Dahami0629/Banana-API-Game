document.addEventListener("DOMContentLoaded", async () => {
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profileTotalScore = document.getElementById("profileTotalScore");
  const profileHighestScore = document.getElementById("profileHighestScore");
  const profileGamesPlayed = document.getElementById("profileGamesPlayed");
  const profileAvatar = document.getElementById("profileAvatar");
  const selectAvatar = document.getElementById("selectAvatar");
  const avatarPopup = document.getElementById("avatarSelectionPopup");
  const avatarOptions = document.getElementById("avatarOptions");
  const closePopup = document.getElementById("closePopup");

  if (!firebase.apps.length) {
      console.error("❌ Firebase is not initialized.");
      return;
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  auth.onAuthStateChanged(async (user) => {
      if (user) {
          const userId = user.uid;
          const userRef = db.collection("users").doc(userId);

          try {
              const doc = await userRef.get();
              if (doc.exists) {
                  const data = doc.data();
                  profileName.textContent = data.username || "Unknown";
                  profileEmail.textContent = data.email || "No Email";
                  profileTotalScore.textContent = data.totalScore || 0;
                  profileHighestScore.textContent = data.highestScore || 0;
                  profileGamesPlayed.textContent = data.gamesPlayed || 0;

                  
                  if (data.profileImage) {
                      profileAvatar.src = data.profileImage;
                  }
              } else {
                  console.error("❌ User document not found.");
              }
          } catch (error) {
              console.error("❌ Error fetching user data:", error);
          }
      } else {
          console.error("❌ No user logged in.");
          window.location.href = "../html/SignupPage.html";
      }
  });

  
  async function loadAvatars() {
      try {
          const avatarsRef = db.collection("avatars");
          const snapshot = await avatarsRef.get();

          avatarOptions.innerHTML = ""; 

          snapshot.forEach((doc) => {
              const avatarData = doc.data();
              const img = document.createElement("img");
              img.src = avatarData.url;
              img.alt = "Avatar";
              img.addEventListener("click", async () => {
                  await updateUserAvatar(auth.currentUser.uid, avatarData.url);
              });

              avatarOptions.appendChild(img);
          });
      } catch (error) {
          console.error("❌ Error loading avatars:", error);
      }
  }

  
  async function updateUserAvatar(userId, avatarUrl) {
      try {
          await db.collection("users").doc(userId).update({
              profileImage: avatarUrl
          });

          profileAvatar.src = avatarUrl;
          console.log("✅ Avatar updated successfully!");
          avatarPopup.classList.add("hidden");
      } catch (error) {
          console.error("❌ Error updating avatar:", error);
      }
  }

  
  selectAvatar.addEventListener("click", async () => {
      avatarPopup.classList.remove("hidden");
      await loadAvatars();
  });

 
  closePopup.addEventListener("click", () => {
      avatarPopup.classList.add("hidden");
  });
});

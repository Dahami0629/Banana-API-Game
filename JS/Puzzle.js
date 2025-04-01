let userId = null;
let username = null;
let correctSolution = null;
let score = 0;
let shields = 5;
let difficulty = localStorage.getItem("difficulty") || "easy";
let timeLeft;
let timerInterval;

const screenWidth = window.innerWidth;
const scoreShow = document.getElementById("score");
const shieldsContainer = document.getElementById("shieldsContainer");
let manPosition = screenWidth / 2;
let zombiePosition = 50;
const manStep = 80;
const zombieStep = 80;

auth.onAuthStateChanged((user) => {
    if (user) {
        userId = user.uid;
        db.collection("users").doc(userId).get().then((doc) => {
            if (doc.exists) {
                username = doc.data().username;
                document.getElementById("playerGreeting").textContent = `Welcome, ${username}!`;
            }
        }).catch((error) => {
            console.error("Error fetching user data:", error);
        });
    } else {
        console.log("No user logged in.");
        window.location.href = "../html/LandingPage.html";
    }
});


document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;

function fetchPuzzle() {
    fetch("https://marcconrad.com/uob/banana/api.php")
        .then(response => response.json())
        .then(data => {
            if (data && data.question && (data.solution !== undefined)) {
                document.getElementById("puzzleImage").src = data.question;
                correctSolution = data.solution;
                document.getElementById("feedback").textContent = "";
                document.getElementById("answerInput").value = "";

                timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
                startTimer();
            }
        })
        .catch(error => {
            console.error("Error fetching puzzle:", error);
        });
}

function startTimer() {
    clearInterval(timerInterval);
    document.getElementById("timeLeft").textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timeLeft").textContent = timeLeft;
        if (timeLeft <= 0) {
            shields--;
            updateShields();
            if (shields === 0) {
                zombiePosition = manPosition - 50;
                document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
                endGame();
                return;
            } else {
                moveZombie();
            }
            clearInterval(timerInterval);
            document.getElementById("feedback").textContent = "⏳ Time's up! Try again.";
            mainScore(-5);
            showPopup("Time's Up!", fetchPuzzle);
        }
    }, 1000);
}

document.getElementById("checkButton").addEventListener("click", function () {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    if (isNaN(userAnswer)) {
        document.getElementById("feedback").textContent = "Enter a number!";
        return;
    }
    handleAnswer(userAnswer === correctSolution);
    fetchPuzzle();
});

function handleAnswer(isCorrect) {
    let points = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
    if (isCorrect) {
        mainScore(points);
        moveMan();
        document.getElementById("feedback").textContent = "Answer Correct";
    } else {
        mainScore(-points / 2);
        shields--;
        document.getElementById("feedback").textContent = "Answer Wrong";
        if (shields === 0) {
            zombiePosition = manPosition - 50;
            document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
            endGame();
            return;
        }
        moveZombie();
    }
    updateShields();
}

function mainScore(points) {
    score = Math.max(0, score + points);
    scoreShow.textContent = `Score: ${score}`;
}

function updateShields() {
    shieldsContainer.innerHTML = "";
    for (let i = 0; i < shields; i++) {
        let shieldImg = document.createElement("img");
        shieldImg.src = "../assests/ImagesNew/shields.png";
        shieldImg.alt = "Shield";
        shieldImg.className = "shield";
        shieldsContainer.appendChild(shieldImg);
    }
}

function moveMan() {
    if (manPosition + manStep < screenWidth - 120) {
        manPosition += manStep;
        document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
        if (manPosition >= screenWidth - 250) {
            winGame();
        }
    }
}

function moveZombie() {
    if (zombiePosition >= manPosition - 100) {
        endGame();
    } else {
        zombiePosition += zombieStep;
        document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
    }
}

function showPopup(message, callback) {
    document.getElementById("popupText").textContent = message;
    document.getElementById("popupMessage").style.display = "flex";
    document.getElementById("popupOkButton").onclick = function () {
        closePopup();
        if (callback) callback();
    };
}

function closePopup() {
    document.getElementById("popupMessage").style.display = "none";
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById("feedback").textContent = "❌ Game Over! The zombie got you!";
    showPopup("Game Over! The zombie caught you! Try again?", resetGame);
}

function winGame() {
    clearInterval(timerInterval);
    document.getElementById("feedback").textContent = "🎉 You reached the car! You win!";
    showPopup("🏆 Congratulations! You escaped the zombie!", () => {
        increaseDifficulty();
        resetGame();
    });
}

function increaseDifficulty() {
    if (difficulty === "easy") {
        difficulty = "medium";
    } else if (difficulty === "medium") {
        difficulty = "hard";
    }
    localStorage.setItem("difficulty", difficulty);
}

function resetGame() {
    shields = 5;
    manPosition = screenWidth / 2;
    zombiePosition = 50;
    scoreShow.textContent = `Score: ${score}`;
    updateShields();
    document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
    document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
    fetchPuzzle();
}

function goBack() {
    window.history.back();
    indow.location.href = "../html/GamePage.html";
}

async function save_Score() {
    if (!userId) {
        console.error("No user ID found, cannot save score.");
        return;
    }
    showPopup("Saving your Progress...");

    const userRef = db.collection("users").doc(userId);
    const scoresRef = db.collection("scores").doc();

    try {
        const doc = await userRef.get();
        if (doc.exists) {
            let userData = doc.data();
            let highestScore = userData.highestScore || 0;
            let totalScore = userData.totalScore || 0;
            let gamesPlayed = userData.gamesPlayed || 0;

            await userRef.update({
                highestScore: Math.max(highestScore, score),
                totalScore: totalScore + score,
                gamesPlayed: gamesPlayed + 1
            });
            console.log("✅ User stats updated in Firestore");

            await scoresRef.set({
                userId: userId,
                username: username,
                score: score,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("✅ Score saved in scores collection");
        } else {
            console.error("❌ User document not found in Firestore");
        }

        window.location.href = "../html/LandingPage.html";

    } catch (error) {
        console.error("❌ Error saving score and logging out:", error);
    }
}

updateShields();
fetchPuzzle();

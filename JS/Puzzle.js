let correctSolution = null;
let score = 0;
let progress = 0;
let difficulty = localStorage.getItem("selectedLevel") || "easy";  
let playerName = localStorage.getItem("playerName") || "Adventurer";  
let timeLeft;
let timerInterval;
let manPosition = 50;  
let zombiePosition = 0;  
const manStep = 80;  
const zombieStep = 80;  

document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
document.getElementById("playerGreeting").textContent = `Welcome, ${playerName}! Your challenge awaits.`;

// 🏃 Move the man forward
function moveMan() {
    if (manPosition < window.innerWidth - 120) {
        manPosition += manStep;
        document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
    }
}

// 🧟 Move the zombie closer
function moveZombie() {
    if (zombiePosition < manPosition) {
        zombiePosition += zombieStep;
        document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
    }
}

// ⏳ Start the timer
function startTimer() {
    clearInterval(timerInterval);
    document.getElementById("timeLeft").textContent = timeLeft;
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById("timeLeft").textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            document.getElementById("feedback").textContent = "⏳ Time's up! Try again.";
            showTryAgainPopup();
        }
    }, 1000);
}

// 🧩 Fetch a new puzzle
function fetchPuzzle() {
    fetch("https://marcconrad.com/uob/banana/api.php")
        .then(response => response.json())
        .then(data => {
            if (data && data.question && (data.solution !== undefined)) {
                document.getElementById("puzzleImage").src = data.question;
                correctSolution = data.solution;
                document.getElementById("feedback").textContent = "";
                document.getElementById("answerInput").value = "";
                
                // Set the time based on difficulty
                timeLeft = difficulty === "easy" ? 40 : difficulty === "medium" ? 30 : 20;
                startTimer();
            }
        })
        .catch(error => {
            console.error("Error fetching puzzle:", error);
        });
}

// ✅ Check answer
document.getElementById("checkButton").addEventListener("click", function () {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    if (isNaN(userAnswer)) {
        document.getElementById("feedback").textContent = "Enter a number!";
        return;
    }

    if (userAnswer === correctSolution) {
        document.getElementById("feedback").textContent = "✅ Correct! 🌟";
        score += difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
        document.getElementById("score").textContent = `Score: ${score}`;
        moveMan();
        updateProgress(true);
    } else {
        document.getElementById("feedback").textContent = "❌ Wrong answer! Try again.";
        updateProgress(false);
    }

    fetchPuzzle();
});

// 📊 Update progress
function updateProgress(correct) {
    if (correct) {
        progress += difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 30;
    } else {
        progress -= 5;
        if (progress < 0) progress = 0;
        moveZombie();

        if (zombiePosition >= manPosition) {
            endGame();
        }
    }

    if (progress > 100) progress = 100;

    let progressBarColor = progress >= 80 ? "green" : progress >= 50 ? "yellow" : "red";
    
    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("progress").style.backgroundColor = progressBarColor;
    document.getElementById("progressText").textContent = `${progress}%`;

    if (progress >= 100) {
        document.getElementById("treasure").style.display = "block";
        document.getElementById("feedback").textContent = "🏆 You found the treasure!";
    }
}

// ❌ End game if zombie catches the player
function endGame() {
    clearInterval(timerInterval);
    document.getElementById("feedback").textContent = "❌ Game Over! The zombie got you!";
    showTryAgainPopup();
}

// 🔄 Show "Try Again" popup
function showTryAgainPopup() {
    document.getElementById("overlay").style.display = "flex";
}

// 🔁 Reset game when "Try Again" is clicked
document.getElementById("tryAgainButton").addEventListener("click", function () {
    document.getElementById("overlay").style.display = "none";
    score = 0;
    progress = 0;
    manPosition = 50;
    zombiePosition = 0;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("progress").style.width = "0%";  
    document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
    document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
    fetchPuzzle();
});

// 🚀 Start the game
fetchPuzzle();

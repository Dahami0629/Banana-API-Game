let correctSolution = null;
let score = 0;
let progress = 0;
let difficulty = localStorage.getItem("difficulty") || "easy";
let playerName = localStorage.getItem("playerName") || "Adventurer";
let timeLeft;
let manPosition = 50;  
let zombiePosition = 0; 
const manStep = 80;  
const zombieStep = 80; 


document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;

function moveMan() {
    if (manPosition < window.innerWidth - 120) { 
        manPosition += manStep;
        document.getElementById("man").style.transform = `translateX(${manPosition}px)`;
    }
}

function moveZombie() {
    if (zombiePosition < manPosition) {  
        zombiePosition += zombieStep; 
        document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
    }
}

document.getElementById("checkButton").addEventListener("click", function() {
    const userAnswer = parseInt(document.getElementById("answerInput").value, 10);
    if (isNaN(userAnswer)) {
        document.getElementById("feedback").textContent = "Enter a number!";
        return;
    }

    if (userAnswer === correctSolution) {
        document.getElementById("feedback").textContent = "✅ Correct! 🌟";
        score += difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
        document.getElementById("score").textContent = `Score: ${score}`;
        moveMan();  
        updateProgress(true);  
    } else {
        document.getElementById("feedback").textContent = "❌ Wrong answer! Try again.";
        updateProgress(false);  
    }

    
    fetchPuzzle();
});

document.getElementById("playerGreeting").textContent = `Welcome, ${playerName}! Your challenge awaits.`;


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

function checkGameOver() {
    if (zombiePosition >= manPosition) {
        document.getElementById("feedback").textContent = "❌ Game Over! The zombie caught you!";
        showTryAgainPopup();
    }
}

function fetchPuzzle() {
    fetch("https://marcconrad.com/uob/banana/api.php")
        .then(response => response.json())
        .then(data => {
            if (data && data.question && (data.solution !== undefined)) {
                document.getElementById("puzzleImage").src = data.question;
                correctSolution = data.solution;
                document.getElementById("feedback").textContent = "";
                document.getElementById("answerInput").value = "";
                timeLeft = difficulty === 'easy' ? 40 : difficulty === 'medium' ? 30 : 20;
                startTimer();
            }
        })
        .catch(error => {
            console.error("Error fetching puzzle:", error);
        });
}


function updateProgress(correct) {
    
    if (correct) {
        progress += difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
    } else {
        progress -= 5;
        if (progress < 0) progress = 0;

        moveZombie(); 

        if (zombiePosition >= manPosition) {
            endGame();
        }
    }

    
    if (progress > 100) progress = 100;

    
    let progressBarColor = 'red';
    if (progress >= 80) {
        progressBarColor = 'green';  
    } else if (progress >= 50) {
        progressBarColor = 'yellow';  
    }

    
    document.getElementById("progress").style.width = `${progress}%`;
    document.getElementById("progress").style.backgroundColor = progressBarColor;  
    document.getElementById("progressText").textContent = `${progress}%`;

    function moveZombie() {
        if (zombiePosition < manPosition) {
            zombiePosition += zombieStep; // Move zombie forward
            document.getElementById("zombie").style.transform = `translateX(${zombiePosition}px)`;
        }
    }
    if (progress >= 100) {
        document.getElementById("treasure").style.display = "block";
        document.getElementById("feedback").textContent = "🏆 You found the treasure!";
    }
}

function endGame() {
    clearInterval(timerInterval);
    document.getElementById("feedback").textContent = "❌ Game Over! The zombie got you!";
}

function showTryAgainPopup() {
    document.getElementById("overlay").style.display = "flex";
}

document.getElementById("tryAgainButton").addEventListener("click", function() {
    document.getElementById("overlay").style.display = "none";
    score = 0;
    progress = 0;
    distance = 0;
    zombieSize = 50;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("progress").style.width = "0%";  
    fetchPuzzle();
});

fetchPuzzle();

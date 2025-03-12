function selectLevel(level) {
    const nameInput = document.getElementById("playerName").value.trim();
    if (!nameInput) {
        alert("Please enter your name before selecting a level!");
        return;
    }

    localStorage.setItem("playerName", nameInput);
    localStorage.setItem("difficulty", level);

    
    window.location.href = `PuzzleNew.html?difficulty=${level}`;
}

       
function selectLevel(level) {
    localStorage.setItem("selectedLevel", level);
    window.location.href = "/Banana-API-Game/puzzle.html";
}

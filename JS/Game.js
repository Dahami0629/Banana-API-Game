function selectLevel(level) {
    localStorage.setItem("difficulty", level);
    window.location.href = `PuzzleNew.html?difficulty=${encodeURIComponent(level)}`;
}
function goHome() {
    window.location.href = "/html/LandingPage.html"; 
}
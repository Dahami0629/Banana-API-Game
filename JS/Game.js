function selectLevel(level) {
    localStorage.setItem("difficulty", level);
    window.location.href = `PuzzleNew.html?difficulty=${encodeURIComponent(level)}`;
}

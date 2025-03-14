function showForm(form) {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');

    if (form === 'login') {
        loginForm.classList.add('active');
        signupForm.classList.remove('active');
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
    } else {
        signupForm.classList.add('active');
        loginForm.classList.remove('active');
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}


document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); 
    window.location.href = "GamePage.html"; 
});
function goHome() {
    window.location.href = "/html/LandingPage.html"; 
}
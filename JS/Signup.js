document.getElementById("signupBtn").addEventListener("click", function () {
    showForm("signup"); // Calls showForm function to switch to the signup tab
});

function showForm(type) {
    // Remove 'active' class from all forms and tabs
    document.querySelectorAll(".form").forEach(form => form.classList.remove("active"));
    document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));

    if (type === "login") {
        document.getElementById("loginForm").classList.add("active");
        document.getElementById("loginTab").classList.add("active");
       
    } else {
        document.getElementById("signupForm").classList.add("active");
        document.getElementById("signupTab").classList.add("active");
    }
}

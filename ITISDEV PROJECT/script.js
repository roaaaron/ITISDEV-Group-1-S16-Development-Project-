// Simulating a backend with localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];

// Sign-Up Functionality
const signupForm = document.getElementById("signup-form");
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value.trim();
        const email = document.getElementById("signup-email").value.trim();
        const password = document.getElementById("signup-password").value;

        if (users.some(user => user.email === email)) {
            alert("Email is already registered. Please use a different email or log in.");
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Sign-Up Successful! Please Login.");
        window.location.href = "login.html";
    });
}

// Login Functionality
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value.trim();
        const password = document.getElementById("login-password").value;

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            alert("Login Successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid Email or Password. Please try again.");
        }
    });
}

// Logout Functionality
const logoutButton = document.getElementById("logout");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        alert("You have been logged out.");
        window.location.href = "login.html";
    });
}

// Redirect to login if not authenticated
const authenticatedPages = ["index.html", "expenses.html", "add.html"];
const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser && authenticatedPages.some(page => window.location.href.includes(page))) {
    alert("You must be logged in to access this page.");
    window.location.href = "login.html";
}

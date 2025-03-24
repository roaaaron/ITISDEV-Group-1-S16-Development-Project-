//takes form input and tries using it to register a new user
function signUp() {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value;

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    alert("Sign-Up Successful! Please Login.");
                    window.location.href = "login.html";
                })
                .catch((error) => {
                    alert(error.message);
                });
        });
    }
}

//takes form input and tries logging into the app
function signIn() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(() => {
                    alert("Login Successful!");
                    window.location.href = "index.html";
                })
                .catch(() => {
                    alert("Invalid Email or Password. Please try again.");
                });
        });
    }
}

// Run both functions on page load
window.onload = () => {
    signUp();
    signIn();
};

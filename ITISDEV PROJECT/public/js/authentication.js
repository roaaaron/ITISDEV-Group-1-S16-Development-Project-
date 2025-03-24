function signUp() {
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("signup-email").value.trim();
            const password = document.getElementById("signup-password").value;

            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    user.sendEmailVerification()
                        .then(() => {
                            alert("A verification email has been sent. Please check your inbox.");
                            window.location.href = "login.html";
                        })
                        .catch((error) => {
                            console.error("Error sending verification email:", error);
                            alert("Error: " + error.message);
                        });
                })
                .catch((error) => {
                    console.error("Sign-up error:", error);
                    alert(error.message);
                });
        });
    }
}


function signIn() {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("login-email").value.trim();
            const password = document.getElementById("login-password").value;

            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const user = userCredential.user;

                    if (!user.emailVerified) {
                        alert("Please verify your email before logging in.");
                        firebase.auth().signOut();
                    } else {
                        alert("Login Successful!");
                        window.location.href = "index.html";
                    }
                })
                .catch(() => {
                    alert("Invalid Email or Password. Please try again.");
                });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const logoutButton = document.getElementById("logout");

    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();
            logOut();
        });
    }
});

function logOut() {
    firebase.auth().signOut().then(() => {
        alert("You have been logged out.");
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

function checkAuthStatus() {
    firebase.auth().onAuthStateChanged((user) => {
        if (!user) {
            window.location.href = "login.html";
            alert("You must be logged in to access this page.");
        }
    });
}

window.onload = () => {
    signUp();
    signIn();
};

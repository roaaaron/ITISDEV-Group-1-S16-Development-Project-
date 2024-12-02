// Simulating a backend with localStorage
const users = JSON.parse(localStorage.getItem("users")) || [];

// Function to add an automatic admin 
function ensureAdminUser() {
    const adminExists = users.some(user => user.email === "admin@gmail.com");
    
    if (!adminExists) {
        users.push({ 
            name: "admin", 
            email: "admin@gmail.com", 
            password: "admin", 
            role: "Admin" 
        });
        localStorage.setItem("users", JSON.stringify(users));
        console.log("Admin user created: admin@gmail.com (password: admin)");
    }
}

// Call ensureAdminUser on page load
document.addEventListener("DOMContentLoaded", ensureAdminUser);

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

        users.push({ name, email, password, role: "Viewer" });
        localStorage.setItem("users", JSON.stringify(users));
        alert("Sign-Up Successful! You have been registered as a Viewer. Please Login.");
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
            localStorage.setItem("role", user.role);
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

//For user-management.html

// Function to render user cards dynamically
function renderUsers() {
    const userContainer = document.querySelector(".user-container");

    userContainer.innerHTML = `
        <h1 class="section-title">Users</h1>
    `;

    users.forEach((user, index) => {
        const userCard = document.createElement("div");
        userCard.classList.add("user-card");

        userCard.innerHTML = `
            <h2 class="user-name">${user.name}</h2>
            <p class="user-role">Role: ${user.role || "Viewer"}</p>
            <button class="toggle-role-btn" data-index="${index}">
                ${user.role === "Admin" ? "Set to Viewer" : "Set to Admin"}
            </button>
            <button class="delete-user-btn" data-index="${index}">Delete User</button>
        `;

        userContainer.appendChild(userCard);
    });

    const toggleRoleButtons = document.querySelectorAll(".toggle-role-btn");
    toggleRoleButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const userIndex = e.target.getAttribute("data-index");
            toggleUserRole(userIndex, e.target);
        });
    });

    const deleteUserButtons = document.querySelectorAll(".delete-user-btn");
    deleteUserButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const userIndex = e.target.getAttribute("data-index");
            confirmDeleteUser(userIndex);
        });
    });
}

// Function to toggle user role
function toggleUserRole(index, button) {
    const user = users[index];

    if (user.role === "Admin") {
        user.role = "Viewer";
        button.textContent = "Set to Admin";
    } else {
        user.role = "Admin";
        button.textContent = "Set to Viewer"; 
    }

    localStorage.setItem("users", JSON.stringify(users));

    const userRoleDisplay = button.previousElementSibling;
    userRoleDisplay.textContent = `Role: ${user.role}`;
}

// Function to confirm delete user
function confirmDeleteUser(index) {
    const isConfirmed = confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
        deleteUser(index);
    }
}

// Function to delete user
function deleteUser(index) {
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers(); 
}


// Call renderUsers on page load
document.addEventListener("DOMContentLoaded", renderUsers);

document.addEventListener("DOMContentLoaded", () => {
    const currentUserRole = localStorage.getItem("role") || "Viewer";

    const restrictedPages = ["add.html", "upload.html", "user-management.html"];

    restrictedPages.forEach((page) => {
        const restrictedLink = document.querySelector(`a[href="${page}"]`);
        if (restrictedLink) {
            restrictedLink.addEventListener("click", (event) => {
                if (currentUserRole !== "Admin") {
                    event.preventDefault();
                    showPopupMessage();
                }
            });
        }
    });
});

// Function to display the popup message
function showPopupMessage() {
    const popup = document.createElement("div");
    popup.classList.add("popup");
    alert("Administrators Only! Contact your admin for additional capabilities.");

    document.body.appendChild(popup);

    const closeButton = popup.querySelector(".close-popup-btn");
    closeButton.addEventListener("click", () => {
        document.body.removeChild(popup);
    });
}

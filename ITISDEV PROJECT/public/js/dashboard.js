// Sample project data (can be replaced with dynamic data)
const projects = JSON.parse(localStorage.getItem("projects")) || [
    {
        id: 1,
        name: "Building A",
        status: "In Progress",
        completion: 45, // percentage
        budgetStatus: "On Track",
        deadline: "2024-12-01",
    },
    {
        id: 2,
        name: "Building B",
        status: "At Risk",
        completion: 60,
        budgetStatus: "Over Budget",
        deadline: "2024-11-25",
    },
    {
        id: 3,
        name: "Building C",
        status: "Completed",
        completion: 100,
        budgetStatus: "Under Budget",
        deadline: "2024-10-15",
    },
];

// Generate project summary cards
function renderProjectSummaries() {
    const container = document.getElementById("project-summary-container");
    container.innerHTML = ""; // Clear existing content

    projects.forEach((project) => {
        const progressColor =
            project.status === "Completed"
                ? "green"
                : project.status === "At Risk"
                ? "red"
                : "yellow";

        container.innerHTML += `
            <div class="project-card">
                <h3>${project.name}</h3>
                <p>Status: <span class="${progressColor}">${project.status}</span></p>
                <p>Completion: ${project.completion}%</p>
                <div class="progress-bar-container">
                    <div class="progress-bar" style="width: ${project.completion}%"></div>
                </div>
                <p>Budget Status: ${project.budgetStatus}</p>
                <p>Deadline: ${project.deadline}</p>
            </div>
        `;
    });
}

// Generate alerts and notifications
function renderAlerts() {
    const alertsList = document.getElementById("alerts-list");
    alertsList.innerHTML = ""; // Clear existing alerts

    projects.forEach((project) => {
        const deadline = new Date(project.deadline);
        const today = new Date();
        const daysRemaining = Math.ceil(
            (deadline - today) / (1000 * 60 * 60 * 24)
        );

        if (daysRemaining <= 7 && project.status !== "Completed") {
            alertsList.innerHTML += `<li>${project.name} is approaching its deadline (${project.deadline}).</li>`;
        }

        if (project.budgetStatus === "Over Budget") {
            alertsList.innerHTML += `<li>${project.name} is over budget!</li>`;
        }

        if (project.status === "At Risk") {
            alertsList.innerHTML += `<li>${project.name} is marked as "At Risk". Please review.</li>`;
        }
    });
}

// Initialize dashboard
function initializeDashboard() {
    renderProjectSummaries();
    renderAlerts();
}

// Run initialization on page load
window.addEventListener("DOMContentLoaded", initializeDashboard);

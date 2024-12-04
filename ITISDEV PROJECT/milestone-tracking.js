
async function fetchProjects() {
    try {
        const response = await fetch('/api/projects'); // Fetch all projects from the backend
        const projects = await response.json();

        if (projects.length === 0) {
            console.error('No projects found');
            return;
        }

        populateProjectSelector(projects); // Populate the dropdown menu
    } catch (err) {
        console.error("Error fetching projects:", err);
    }
}

// Populate project selector
function populateProjectSelector(projects) {
    const selector = document.getElementById("project-selector");
    selector.innerHTML = ""; // Clear existing options

    projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        selector.appendChild(option);
    });

    // Default selection
    if (projects.length > 0) {
        renderMilestones(projects[0].id);
    }
}

// Render milestones for a selected project
async function renderMilestones(projectId) {
    const container = document.getElementById("milestone-container");
    container.innerHTML = ""; // Clear existing content

    try {
        const response = await fetch(`/api/milestones/${projectId}`); // Fetch by projectId
        const milestones = await response.json();

        if (milestones.length === 0) {
            container.innerHTML = "<p>No milestones available for this project.</p>";
            return;
        }

        milestones.forEach((milestone) => {
            const statusColor =
                milestone.status === "Completed" ? "green" :
                milestone.status === "In Progress" ? "yellow" :
                "gray";

            container.innerHTML += `
                <div class="milestone-card">
                    <h4>${milestone.title}</h4>
                    <p>Status: <span style="color:${statusColor}">${milestone.status}</span></p>
                    <p>Deadline: ${new Date(milestone.dueDate).toLocaleDateString()}</p>
                    <p>Description: ${milestone.description}</p>
                </div>
            `;
        });
    } catch (err) {
        console.error("Error rendering milestones:", err);
        container.innerHTML = "<p>Error loading milestones.</p>";
    }
}

// Handle project change event
document.getElementById("project-selector").addEventListener("change", (event) => {
    renderMilestones(event.target.value);
    console.log("Selected Project ID:", selectedProjectId, "Type:", typeof selectedProjectId);
});

// Initialize milestone page
function initializeMilestonePage() {
    fetchProjects();
}

// Run initialization on page load
window.addEventListener("DOMContentLoaded", initializeMilestonePage);
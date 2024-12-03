
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

// Populate project selector
function populateProjectSelector() {
    const selector = document.getElementById("project-selector");
    selector.innerHTML = ""; // Clear existing options

    projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        selector.appendChild(option);
    });

    // Default selection
    renderMilestones(projects[0]?.id);
}

// Handle project change event
document.getElementById("project-selector").addEventListener("change", (event) => {
    renderMilestones(parseInt(event.target.value));
});

// Initialize milestone page
function initializeMilestonePage() {
    populateProjectSelector();
}

// Run initialization on page load
window.addEventListener("DOMContentLoaded", initializeMilestonePage);
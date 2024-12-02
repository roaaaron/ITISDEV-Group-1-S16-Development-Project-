// const milestoneData = JSON.parse(localStorage.getItem("milestones")) || {
//     1: [ // Project ID 1 (Building A)
//         { id: 101, name: "Foundation Setup", status: "Completed", deadline: "2024-10-15" },
//         { id: 102, name: "Framing", status: "In Progress", deadline: "2024-12-01" },
//     ],
//     2: [ // Project ID 2 (Building B)
//         { id: 201, name: "Electrical Wiring", status: "At Risk", deadline: "2024-11-25" },
//         { id: 202, name: "Roof Installation", status: "Not Started", deadline: "2024-12-15" },
//     ],
//     3: [ // Project ID 3 (Building C)
//         { id: 301, name: "Painting", status: "Completed", deadline: "2024-10-05" },
//     ],
// };

// // Save milestones back to localStorage for persistence
// function saveMilestones() {
//     localStorage.setItem("milestones", JSON.stringify(milestoneData));
// }

// Render milestones for a selected project
function renderMilestones(projectId) {
    const container = document.getElementById("milestone-container");
    const milestones = milestoneData[projectId] || [];
    container.innerHTML = ""; // Clear existing content

    milestones.forEach((milestone) => {
        const statusColor =
            milestone.status === "Completed" ? "green" :
            milestone.status === "In Progress" ? "yellow" :
            milestone.status === "At Risk" ? "red" :
            "gray";

        container.innerHTML += `
            <div class="milestone-card">
                <h4>${milestone.name}</h4>
                <p>Status: <span class="${statusColor}">${milestone.status}</span></p>
                <p>Deadline: ${milestone.deadline}</p>
            </div>
        `;
    });

    if (milestones.length === 0) {
        container.innerHTML = "<p>No milestones available for this project.</p>";
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
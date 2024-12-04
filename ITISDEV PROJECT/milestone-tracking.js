
const milestones = JSON.parse(localStorage.getItem("milestones")) || [
    {
        "id": 1,
        "projectId": 1,
        "title": "Foundation Work",
        "status": "In Progress",
        "dueDate": "2024-12-05",
        "description": "Complete the foundation work for Building A."
    },
    {
        "id": 2,
        "projectId": 1,
        "title": "Roof Installation",
        "status": "Not Started",
        "dueDate": "2024-12-20",
        "description": "Install the roof structure."
    },
    {
        "id": 3,
        "projectId": 2,
        "title": "Interior Painting",
        "status": "Not Started",
        "dueDate": "2024-11-30",
        "description": "Paint all interior walls for Building B."
    }
];

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

// Populate localStorage if empty
if (!localStorage.getItem("milestones")) {
    localStorage.setItem("milestones", JSON.stringify(milestones));
}

// Fetch milestones for a specific project
function fetchMilestonesByProjectId(projectId) {
    return milestones.filter((milestone) => milestone.projectId == projectId);
}


async function renderMilestones(projectId) {
    const container = document.getElementById("milestone-container");
    container.innerHTML = ""; // Clear existing content

    const milestones = fetchMilestonesByProjectId(projectId);

    if (milestones.length === 0) {
        container.innerHTML = "<p>No milestones available for this project.</p>";
        return;
    }

    milestones.forEach((milestone) => {
        const statusColor =
            milestone.status === "Completed" ? "green" :
            milestone.status === "In Progress" ? "orange" :
            "red";

        container.innerHTML += `
            <div class="milestone-card">
                <h4>${milestone.title}</h4>
                <p>Status: <span style="color:${statusColor}">${milestone.status}</span></p>
                <p>Deadline: ${new Date(milestone.dueDate).toLocaleDateString()}</p>
                <p>Description: ${milestone.description}</p>
            </div>
        `;
    });
}

function populateProjectSelector(projects) {
    const selector = document.getElementById("project-selector");
    selector.innerHTML = ""; // Clear existing options

    projects.forEach((project) => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.name;
        selector.appendChild(option);
    });

    // Render milestones for the first project by default
    if (projects.length > 0) {
        renderMilestones(projects[0].id);
    }
}

// Initialize milestone tracking page
function initializeMilestonePage() {
    populateProjectSelector(projects);

    // Handle project selection change
    document.getElementById("project-selector").addEventListener("change", (event) => {
        renderMilestones(event.target.value);
    });
}

// Run initialization on page load
window.addEventListener("DOMContentLoaded", initializeMilestonePage);

// async function fetchProjects() {
//     try {
//         const response = await fetch('/api/projects'); // Fetch all projects from the backend
//         const projects = await response.json();

//         if (projects.length === 0) {
//             console.error('No projects found');
//             return;
//         }

//         populateProjectSelector(projects); // Populate the dropdown menu
//     } catch (err) {
//         console.error("Error fetching projects:", err);
//     }
// }

// // Populate project selector
// function populateProjectSelector(projects) {
//     const selector = document.getElementById("project-selector");
//     selector.innerHTML = ""; // Clear existing options

//     projects.forEach((project) => {
//         const option = document.createElement("option");
//         option.value = project.id;
//         option.textContent = project.name;
//         selector.appendChild(option);
//     });

//     // Default selection
//     if (projects.length > 0) {
//         renderMilestones(projects[0].id);
//     }
// }

// // Render milestones for a selected project
// async function renderMilestones(projectId) {
//     const container = document.getElementById("milestone-container");
//     container.innerHTML = ""; // Clear existing content

//     try {
//         const response = await fetch(`/api/milestones/${projectId}`); // Fetch by projectId
//         const milestones = await response.json();

//         if (milestones.length === 0) {
//             container.innerHTML = "<p>No milestones available for this project.</p>";
//             return;
//         }

//         milestones.forEach((milestone) => {
//             const statusColor =
//                 milestone.status === "Completed" ? "green" :
//                 milestone.status === "In Progress" ? "yellow" :
//                 "gray";

//             container.innerHTML += `
//                 <div class="milestone-card">
//                     <h4>${milestone.title}</h4>
//                     <p>Status: <span style="color:${statusColor}">${milestone.status}</span></p>
//                     <p>Deadline: ${new Date(milestone.dueDate).toLocaleDateString()}</p>
//                     <p>Description: ${milestone.description}</p>
//                 </div>
//             `;
//         });
//     } catch (err) {
//         console.error("Error rendering milestones:", err);
//         container.innerHTML = "<p>Error loading milestones.</p>";
//     }
// }

// // Handle project change event
// document.getElementById("project-selector").addEventListener("change", (event) => {
//     renderMilestones(event.target.value);
//     console.log("Selected Project ID:", selectedProjectId, "Type:", typeof selectedProjectId);
// });

// // Initialize milestone page
// function initializeMilestonePage() {
//     fetchProjects();
// }

// // Run initialization on page load
// window.addEventListener("DOMContentLoaded", initializeMilestonePage);
const projectData = {
    buildingA: {
        projectProgress: "85% of Building A is complete.",
        budgetUtilization: "80% of the budget used for Building A.",
        milestoneCompletion: "7 out of 10 milestones completed for Building A."
    },
    buildingB: {
        projectProgress: "60% of Building B is complete.",
        budgetUtilization: "50% of the budget used for Building B.",
        milestoneCompletion: "4 out of 8 milestones completed for Building B."
    },
    buildingC: {
        projectProgress: "40% of Building C is complete.",
        budgetUtilization: "30% of the budget used for Building C.",
        milestoneCompletion: "2 out of 6 milestones completed for Building C."
    }
};

document.getElementById('reportForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const selectedProject = document.getElementById('projectSelect').value;
    const selectedFields = Array.from(document.querySelectorAll('input[name="field"]:checked'))
        .map((checkbox) => checkbox.value);

    // Update preview title
    document.getElementById('projectName').textContent = 
        selectedProject.replace('building', 'Building ');

    // Clear previous table content
    const tableBody = document.querySelector('#reportTable tbody');
    tableBody.innerHTML = '';

    // Populate table with selected fields for the chosen project
    selectedFields.forEach((field) => {
        const row = document.createElement('tr');
        const fieldCell = document.createElement('td');
        const detailCell = document.createElement('td');

        fieldCell.textContent = field.replace(/([A-Z])/g, ' $1').trim(); // Format field name
        detailCell.textContent = projectData[selectedProject][field];

        row.appendChild(fieldCell);
        row.appendChild(detailCell);
        tableBody.appendChild(row);
    });
});

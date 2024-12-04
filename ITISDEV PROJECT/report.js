document.addEventListener('DOMContentLoaded', () => {
    const projectSelect = document.getElementById('projectSelect');
    const milestoneTableBody = document.getElementById('milestoneTableBody');
    const generateReportButton = document.getElementById('generateReportButton');
    const fieldCheckboxes = document.querySelectorAll('.fieldCheckbox');

    // Fetch and populate projects
    fetch('/api/projects')
        .then(response => response.json())
        .then(projects => {
            projects.forEach(project => {
                const option = document.createElement('option');
                option.value = project.projectId;
                option.textContent = project.name;
                projectSelect.appendChild(option);
            });
        })
        .catch(err => {
            console.error('Error fetching projects:', err);
            alert('Failed to fetch projects. Please try again later.');
        });

    // Load milestones for selected project
    projectSelect.addEventListener('change', () => {
        const projectId = projectSelect.value;

        if (!projectId) {
            milestoneTableBody.innerHTML = '<tr><td colspan="4">Please select a project.</td></tr>';
            return;
        }

        fetch(`/api/milestones/${projectId}`)
            .then(response => response.json())
            .then(milestones => {
                milestoneTableBody.innerHTML = ''; // Clear table body
                if (milestones.length === 0) {
                    milestoneTableBody.innerHTML = '<tr><td colspan="4">No milestones found for this project.</td></tr>';
                } else {
                    milestones.forEach((milestone, index) => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${index + 1}</td>
                            <td>${milestone.title}</td>
                            <td>${milestone.status}</td>
                            <td>${new Date(milestone.dueDate).toLocaleDateString()}</td>
                        `;
                        milestoneTableBody.appendChild(row);
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching milestones:', err);
                alert('Failed to fetch milestones. Please try again later.');
            });
    });

    // Generate report
    generateReportButton.addEventListener('click', () => {
        const selectedFields = Array.from(fieldCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);

        const projectId = projectSelect.value;

        if (!projectId) {
            alert('Please select a project.');
            return;
        }

        if (selectedFields.length === 0) {
            alert('Please select at least one field for the report.');
            return;
        }

        fetch('/generate-report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}` // Include JWT if applicable
            },
            body: JSON.stringify({ projectId, fields: selectedFields })
        })
            .then(response => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error('Failed to generate report');
                }
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'project_report.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(err => {
                console.error('Error generating report:', err);
                alert('Failed to generate report. Please try again later.');
            });
    });
});

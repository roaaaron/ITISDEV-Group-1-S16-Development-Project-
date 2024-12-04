// Upload form handler
document.getElementById('uploadForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    toggleLoading(true);

    const title = document.getElementById('documentTitle').value.trim();
    const tags = document.getElementById('tags').value.trim();
    const file = document.getElementById('documentFile').files[0];

    if (!title || !file) {
        alert('Title and document file are required!');
        toggleLoading(false);
        return;
    }

    // Prepare the document data
    const documentData = {
        title,
        tags: tagsArray,
        filePath: file.path,
        userId: req.user._id
    });

    await newDocument.save();
    res.json({ message: 'File uploaded successfully!' });
});

// Document Search
app.get('/search', authenticateUser, async (req, res) => {
    const { q } = req.query;
    const results = await Document.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { tags: { $regex: q, $options: 'i' } }
        ],
        userId: req.user._id
    });

    res.json({ documents: results });
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const PDFDocument = require('pdfkit');

// Route to Generate PDF Report
// app.post('/generate-report', authenticateUser, async (req, res) => {
//     const { projectId, fields } = req.body;

//     try {
//         // Fetch project details
//         const project = await Project.findOne({ projectId });
//         if (!project) return res.status(404).json({ message: 'Project not found' });

//         // Fetch milestones related to the project
//         const milestones = await Milestone.find({ projectId });

//         // Create PDF
//         const PDFDocument = require('pdfkit');
//         const doc = new PDFDocument();
//         const buffers = [];

//         doc.on('data', buffers.push.bind(buffers));
//         doc.on('end', () => {
//             const pdfData = Buffer.concat(buffers);
//             res.setHeader('Content-Type', 'application/pdf');
//             res.setHeader('Content-Disposition', 'attachment; filename=project_report.pdf');
//             res.send(pdfData);
//         });

//         // Add project details to PDF
//         doc.fontSize(16).text('Project Report', { align: 'center' });
//         doc.moveDown();
//         doc.fontSize(12).text(`Project Name: ${project.name}`);
//         doc.text(`Status: ${project.status}`);
//         doc.text(`Completion: ${project.completion}%`);
//         doc.text(`Budget Status: ${project.budgetStatus}`);
//         doc.text(`Deadline: ${new Date(project.deadline).toLocaleDateString()}`);
//         doc.moveDown();

//         // Include milestones if requested
//         if (fields.includes('milestones')) {
//             doc.fontSize(14).text('Milestones:');
//             milestones.forEach((milestone, index) => {
//                 doc.fontSize(12).text(
//                     `${index + 1}. ${milestone.title} - ${milestone.status} (Due: ${new Date(
//                         milestone.dueDate
//                     ).toLocaleDateString()})`
//                 );
//             });
//             doc.moveDown();
//         }

//         doc.end();
//     } catch (err) {
//         console.error('Error generating report:', err);
//         res.status(500).json({ message: 'Error generating report' });
//     }
// });

app.post('/generate-report', authenticateUser, async (req, res) => {
    const { project, fields } = req.body;

    // Fetch project data
    const projectDetails = projectData[project];

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');
        res.send(pdfData);
    });

    doc.fontSize(16).text(`Report for ${project.replace('building', 'Building ')}`, { align: 'center' });
    doc.moveDown();

    fields.forEach(field => {
        doc.fontSize(12).text(`${field.replace(/([A-Z])/g, ' $1')}: ${projectDetails[field]}`);
        doc.moveDown();
    });

    doc.end();
});


// Fetch all projects
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

// Fetch milestones by projectId
app.get('/api/milestones/:projectId', async (req, res) => {
    const { projectId } = req.params;
    try {
        const milestones = await Milestone.find({ projectId });
        res.json(milestones);
    } catch (err) {
        console.error('Error fetching milestones:', err);
        res.status(500).json({ message: 'Error fetching milestones' });
    }
});




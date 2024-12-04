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


    const documentData = {
        title,
        tags: tagsArray,
        filePath: file.path,
        userId: req.user._id
    });

    await newDocument.save();
    res.json({ message: 'File uploaded successfully!' });
});

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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const PDFDocument = require('pdfkit');

app.post('/generate-report', authenticateUser, async (req, res) => {
    const { project, fields } = req.body;

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


app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

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




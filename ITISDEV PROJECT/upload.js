const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));  // Serve uploaded files


// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/", {})
    .then(() => {
        console.log('MongoDB connected');
        populateDatabase();
    })
    .catch(err => console.log(err));

// Imports Schemas
const { User, Document, Milestone, Project } = require('./models/schemas');

// Populates DB with sample data w dupe handling
async function populateDatabase() {
    try {
        // Import sample data
        const projects_sample_json = require('./models/sample_data/projects.json');
        const milestones_sample_json = require('./models/sample_data/milestones.json');
        // Debugging
        console.log('Sample Data:', milestones_sample_json);
        console.log('Number of Documents:', milestones_sample_json.length);

        const projectCount = await Project.countDocuments();
        if (projectCount === 0) {
            await Project.insertMany(projects_sample_json);
            console.log('Project sample data inserted successfully.');
        } else {
            console.log('Project data already exists. Skipping insertion.');
        }

        // Check if milestone data exists
        const milestoneCount = await Milestone.countDocuments();
        if (milestoneCount === 0) {
            await Milestone.insertMany(milestones_sample_json);
            console.log('Milestone sample data inserted successfully.');
        } else {
            console.log('Milestone data already exists. Skipping insertion.');
        }
    } catch (err) {
        console.error('Error during database population:', err);
    }
}

// Define storage settings for multer (file upload)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// User Authentication Middleware (JWT)
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

app.use(express.static(path.join(__dirname)));

// Routes
// feel free to re-arrange
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'add.html'));
});

app.get('/expenses', (req, res) => {
    res.sendFile(path.join(__dirname, 'expenses.html'));
});

app.get('/milestone-tracking', (req, res) => {
    res.sendFile(path.join(__dirname, 'milestone-tracking.html'));
});

app.get('/generate-report', (req, res) => {
    res.sendFile(path.join(__dirname, 'report.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

app.get('/user-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'user-management.html'));
});

// Milestone Tracking
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find({});
        res.json(projects);
    } catch (err) {
        console.error('Error fetching projects:', err);
        res.status(500).json({ message: 'Error fetching projects' });
    }
});

app.get('/api/milestones/:projectId', async (req, res) => {
    const { projectId } = req.params;
    console.log("Received projectId:", projectId, "Type:", typeof projectId);

    const projectIdNumber = Number(projectId);

    if (isNaN(projectIdNumber)) {
        console.error("Invalid projectId:", projectId);
        return res.status(400).json({ message: "Invalid projectId format." });
    }

    try {
        const milestones = await Milestone.find({ projectId: projectIdNumber });

        if (milestones.length === 0) {
            return res.status(404).json({ message: "No milestones found for this project." });
        }

        res.json(milestones);
    } catch (err) {
        console.error("Error fetching milestones:", err);
        res.status(500).json({ message: "Error fetching milestones." });
    }
});


// app.get('/api/milestones/:projectId', async (req, res) => {
//     const { projectId } = req.params;

//     try {
//         // Fetch milestones for the given projectId
//         const milestones = await Milestone.find({ projectId });

//         if (milestones.length === 0) {
//             return res.status(404).json({ message: 'No milestones found for this project' });
//         }

//         res.json(milestones);
//     } catch (err) {
//         console.error('Error fetching milestones:', err);
//         res.status(500).json({ message: 'Error fetching milestones' });
//     }
// });

// User Registration
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    
    res.json({ message: 'User registered successfully' });
});

// User Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// File Upload and Document Save
app.post('/upload', authenticateUser, upload.single('file'), async (req, res) => {
    const { title, tags } = req.body;
    const { file } = req;

    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    const newDocument = new Document({
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
app.post('/generate-report', authenticateUser, async (req, res) => {
    const { projectId, fields } = req.body;

    try {
        // Fetch project details
        const project = await Project.findOne({ projectId });
        if (!project) return res.status(404).json({ message: 'Project not found' });

        // Fetch milestones related to the project
        const milestones = await Milestone.find({ projectId });

        // Create PDF
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();
        const buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=project_report.pdf');
            res.send(pdfData);
        });

        // Add project details to PDF
        doc.fontSize(16).text('Project Report', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Project Name: ${project.name}`);
        doc.text(`Status: ${project.status}`);
        doc.text(`Completion: ${project.completion}%`);
        doc.text(`Budget Status: ${project.budgetStatus}`);
        doc.text(`Deadline: ${new Date(project.deadline).toLocaleDateString()}`);
        doc.moveDown();

        // Include milestones if requested
        if (fields.includes('milestones')) {
            doc.fontSize(14).text('Milestones:');
            milestones.forEach((milestone, index) => {
                doc.fontSize(12).text(
                    `${index + 1}. ${milestone.title} - ${milestone.status} (Due: ${new Date(
                        milestone.dueDate
                    ).toLocaleDateString()})`
                );
            });
            doc.moveDown();
        }

        doc.end();
    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).json({ message: 'Error generating report' });
    }
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




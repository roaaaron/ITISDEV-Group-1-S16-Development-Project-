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
mongoose.connect("mongodb://localhost:27017/", {serverSelectionTimeoutMS: 30000 })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Imports Schemas
const { User, Document, Milestone, Project } = require('./models/schemas');

// Populate DB with Sample Data
var projects_sample_json = require('./models/sample_data/projects.json')
Project.insertMany(projects_sample_json)

// Debugging
console.log('Sample Data:', projects_sample_json);
console.log('Number of Documents:', projects_sample_json.length);

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

app.get('/report', (req, res) => {
    res.sendFile(path.join(__dirname, 'report.html'));
});

app.get('/upload', (req, res) => {
    res.sendFile(path.join(__dirname, 'upload.html'));
});

app.get('/user-management', (req, res) => {
    res.sendFile(path.join(__dirname, 'user-management.html'));
});


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

// Debugging
// app.post('/',
//     (req, res) => {
//         res.send("POST Request Called")
//     })

// app.listen(PORT,
//         function (err) {
//             if (err) console.log(err);
//             console.log("Server listening on PORT", PORT);
//         });


app.get('/generate-report', (req, res) => {
    res.sendFile(path.join(__dirname, 'report.html'));
});

const PDFDocument = require('pdfkit');

// Route to Generate PDF Report
app.post('/generate-report', authenticateUser, async (req, res) => {
    const { fields } = req.body;

    // Fetch user's project data
    const projects = await Document.find({ userId: req.user._id });

    const doc = new PDFDocument();
    const buffers = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=project_report.pdf');
        res.send(pdfData);
    });

    // PDF Content
    doc.fontSize(16).text('Project Report', { align: 'center' });
    doc.moveDown();

    projects.forEach((project, index) => {
        doc.fontSize(12).text(`Project ${index + 1}: ${project.title}`);
        if (fields.includes('milestones')) {
            doc.text(`Completed Milestones: ${project.milestones || 'N/A'}`);
        }
        if (fields.includes('budget')) {
            doc.text(`Budget Usage: ${project.budget || 'N/A'}`);
        }
        if (fields.includes('tasks')) {
            doc.text(`Pending Tasks: ${project.pendingTasks || 'N/A'}`);
        }
        doc.moveDown();
    });

    doc.end();
});


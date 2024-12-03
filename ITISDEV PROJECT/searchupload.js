const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const path = require('path');
const Document = require('./models/Document'); // Make sure you have a Document model

const app = express();
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/mydb', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware to authenticate JWT tokens
const authenticateUser = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET); // Secret key stored in .env
        console.log('Authenticated user:', req.user);
        next();
    } catch (err) {
        console.error('Invalid token:', err.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

// Multer configuration for file upload
const upload = multer({ 
    dest: 'uploads/', // Save files in 'uploads/' directory
    limits: { fileSize: 10000000 }, // 10 MB file size limit
});

// Upload file route
app.post('/upload', authenticateUser, upload.single('file'), async (req, res) => {
    try {
        console.log('File uploaded:', req.file);
        console.log('User:', req.user);
        console.log('Body:', req.body);

        const { title, tags } = req.body;
        if (!req.file) throw new Error('No file uploaded');

        const document = new Document({
            title,
            tags: tags.split(',').map((tag) => tag.trim()),
            filePath: req.file.path,
            userId: req.user._id,
        });

        await document.save();
        res.json({ message: 'Document uploaded successfully!' });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error uploading document', error });
    }
});

// Search route
app.get('/search', authenticateUser, async (req, res) => {
    try {
        const query = req.query.q || '';
        console.log('Search query:', query);

        const documents = await Document.find({
            userId: req.user._id,
            title: { $regex: query, $options: 'i' }, // Case-insensitive search
        });

        res.json(documents);
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error fetching search results', error });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Server setup
app.listen(3000, () => {
    console.log('Server running on port 3000');
});

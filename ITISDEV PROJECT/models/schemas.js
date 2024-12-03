const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Models
const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Viewer'], default: 'Viewer' }
}));

const Document = mongoose.model('Document', new mongoose.Schema({
    title: String,
    tags: [String],
    filePath: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}));

const milestoneSchema = new Schema ({
    id: {
        type: Number, 
        unique: true, 
        required: true
    },

    projectId: {
        type: String,
        required: true
    },
    
    title: {
        type: String,
        required: true
    },
    
    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },

    dueDate: {
        type: Date,
        required: true
    },

    description: {
        type: String,
        default: ''
    }
});
const Milestone = model('Milestone', milestoneSchema);


const projectSchema = new Schema ({
    id: {
        type: Number,
        unique: true,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ['Not Started', 'In Progress', 'Completed'],
        default: 'Not Started'
    },

    completion: {
        type: Number,  // Store as a percentage (e.g., 45 for 45%)
        min: 0,        
        max: 100,      
        default: 0     
    },

    budgetStatus: {
        type: String,
        enum: ['On Track', 'Over Budget', 'Under Budget'],
        default: 'On Track'
    },

    deadline: {
        type: Date,
        required: true
    }
});
const Project = model('Project', projectSchema);

module.exports = { Milestone, Project };
// don't know if this needs to be done for Document and User since they have different formats


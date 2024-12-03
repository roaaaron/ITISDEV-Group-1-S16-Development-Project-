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

    // projectId: {
    //     type: String,
    //     required
    // },
    // Will need to adjust since projects are locally stored
    
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
module.exports = { Milestone };
// don't know if this needs to be done for Document and User since they have different formats


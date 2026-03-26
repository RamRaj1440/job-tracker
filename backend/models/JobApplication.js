const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Written Test', 'Interview', 'Offered', 'Rejected'],
        default: 'Applied'
    },
    dateApplied: {
        type: Date,
        default: Date.now
    },
    jobLink: {
        type: String,
        trim: true,
        default: ''
    },
    notes: {
        type: String,
        trim: true,
        default: ''
    }
}, { timestamps: true });
module.exports = mongoose.model('JobApplication', jobApplicationSchema);
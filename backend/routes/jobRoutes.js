const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const protect = require('../middleware/authMiddleware');

// ✅ All routes below are protected — user must be logged in

// 1. CREATE — Add new job application
// POST /api/jobs
router.post('/', protect, async (req, res) => {
    try {
        const { company, role, status, dateApplied, jobLink, notes } = req.body;

        const job = await JobApplication.create({
            user: req.user._id,
            company,
            role,
            status: status || 'Applied',
            dateApplied: dateApplied || Date.now(),
            jobLink,
            notes
        });

        res.status(201).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. READ ALL — Get all jobs for logged-in user
// GET /api/jobs
router.get('/', protect, async (req, res) => {
    try {
        const { status, search } = req.query;

        let filter = { user: req.user._id };

        // Filter by status
        if (status && status !== 'All') {
            filter.status = status;
        }

        // Search by company or role
        if (search) {
            filter.$or = [
                { company: { $regex: search, $options: 'i' } },
                { role: { $regex: search, $options: 'i' } }
            ];
        }

        const jobs = await JobApplication.find(filter).sort({ createdAt: -1 });
        res.status(200).json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. READ ONE — Get single job by ID
// GET /api/jobs/:id
router.get('/:id', protect, async (req, res) => {
    try {
        const job = await JobApplication.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user owns this job
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.status(200).json(job);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. UPDATE — Update job application
// PUT /api/jobs/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const job = await JobApplication.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user owns this job
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedJob = await JobApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 5. DELETE — Delete job application
// DELETE /api/jobs/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const job = await JobApplication.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Make sure user owns this job
        if (job.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await JobApplication.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Job application deleted ✅' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 6. DASHBOARD STATS
// GET /api/jobs/stats/summary
router.get('/stats/summary', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        const total = await JobApplication.countDocuments({ user: userId });
        const interviews = await JobApplication.countDocuments({ user: userId, status: 'Interview' });
        const offers = await JobApplication.countDocuments({ user: userId, status: 'Offered' });
        const rejected = await JobApplication.countDocuments({ user: userId, status: 'Rejected' });

        res.status(200).json({ total, interviews, offers, rejected });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
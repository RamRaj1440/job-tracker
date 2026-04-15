const express = require('express');
const router = express.Router();
const JobApplication = require('../models/JobApplication');
const protect = require('../middleware/authMiddleware');
const User = require('../models/User');
const { sendApplicationAddedEmail,
    sendStatusChangedEmail, } = require('../utils/send Email');
// All routes below are protected — user must be logged in

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
        const user = await User.findById(req.user._id);
        if (user) {
            sendApplicationAddedEmail(
                user.email,
                user.name,
                company,
                role,
                status || 'Applied',
                jobLink
            );
        }

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
        const oldStatus = job.status;


        const updatedJob = await JobApplication.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (req.body.status && req.body.status !== oldStatus) {
            const user = await User.findById(req.user._id);
            if (user) {
                sendStatusChangedEmail(
                    user.email,
                    user.name,
                    updatedJob.company,
                    updatedJob.role,
                    oldStatus,
                    req.body.status
                );
            }
        }

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
        res.status(200).json({ message: 'Job application deleted ' });
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

// GET /api/jobs/analytics/full
router.get('/analytics/full', protect, async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. All jobs for this user
        const allJobs = await JobApplication.find({ user: userId });

        // 2. Status breakdown
        const statusBreakdown = {
            Applied: 0,
            'Written Test': 0,
            Interview: 0,
            Offered: 0,
            Rejected: 0,
        };
        allJobs.forEach(job => {
            if (statusBreakdown[job.status] !== undefined) {
                statusBreakdown[job.status]++;
            }
        });

        // 3. Last 30 days trend
        const today = new Date();
        const last30Days = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const count = allJobs.filter(job => {
                const jobDate = new Date(job.dateApplied)
                    .toISOString().split('T')[0];
                return jobDate === dateStr;
            }).length;
            last30Days.push({
                date: date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
                applications: count,
            });
        }

        // 4. Response rate
        const responded = allJobs.filter(job =>
            ['Interview', 'Offered', 'Rejected', 'Written Test'].includes(job.status)
        ).length;
        const responseRate = allJobs.length > 0
            ? Math.round((responded / allJobs.length) * 100)
            : 0;

        // 5. Offer rate
        const offers = allJobs.filter(job => job.status === 'Offered').length;
        const offerRate = allJobs.length > 0
            ? Math.round((offers / allJobs.length) * 100)
            : 0;

        // 6. Top companies (most applied)
        const companyCounts = {};
        allJobs.forEach(job => {
            companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
        });
        const topCompanies = Object.entries(companyCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([company, count]) => ({ company, count }));

        // 7. This week vs last week
        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());
        const lastWeekStart = new Date(thisWeekStart);
        lastWeekStart.setDate(lastWeekStart.getDate() - 7);

        const thisWeek = allJobs.filter(job =>
            new Date(job.dateApplied) >= thisWeekStart
        ).length;
        const lastWeek = allJobs.filter(job =>
            new Date(job.dateApplied) >= lastWeekStart &&
            new Date(job.dateApplied) < thisWeekStart
        ).length;

        // 8. Active applications (not rejected)
        const active = allJobs.filter(job =>
            !['Rejected'].includes(job.status)
        ).length;

        res.json({
            total: allJobs.length,
            active,
            responseRate,
            offerRate,
            statusBreakdown,
            last30Days,
            topCompanies,
            thisWeek,
            lastWeek,
        });

    } catch (error) {
        console.error('Analytics error:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// POST /api/jobs/weekly-summary
// Call this manually or set up a cron job
router.post('/weekly-summary', protect, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        // Get this week's stats
        const thisWeekStart = new Date();
        thisWeekStart.setDate(thisWeekStart.getDate() - 7);

        const allJobs = await JobApplication.find({ user: userId });
        const weekJobs = allJobs.filter(j =>
            new Date(j.dateApplied) >= thisWeekStart
        );

        const stats = {
            total: weekJobs.length,
            interviews: weekJobs.filter(j => j.status === 'Interview').length,
            offers: weekJobs.filter(j => j.status === 'Offered').length,
            rejected: weekJobs.filter(j => j.status === 'Rejected').length,
        };

        // Get top company
        const companyCounts = {};
        weekJobs.forEach(job => {
            companyCounts[job.company] = (companyCounts[job.company] || 0) + 1;
        });
        const topCompany = Object.entries(companyCounts)
            .sort((a, b) => b[1] - a[1])[0]?.[0];

        const { sendWeeklySummaryEmail } = require('../utils/sendEmail');
        await sendWeeklySummaryEmail(user.email, user.name, stats, topCompany);

        res.json({ message: 'Weekly summary sent! ' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
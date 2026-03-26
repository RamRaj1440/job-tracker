const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const protect = require('./middleware/authMiddleware');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
// Connect to MongoDB
connectDB();

const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean);

// Middleware
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
    res.json({ message: 'Job Tracker API is running ✅' });
});
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/protected', protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name}, you are authorized ✅` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



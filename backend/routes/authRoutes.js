const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');



// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'User registered successfully ✅',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // 3. Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Login successful ✅',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        // 2. Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // 3. Save hashed token to DB
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // 4. Set expiry — 15 minutes
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
        await user.save();

        // 5. Build reset URL
        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // 6. Send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: `"Job Tracker" <${process.env.GMAIL_USER}>`,
            to: user.email,
            subject: 'Password Reset Request — Job Tracker',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #0A66C2;">Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>You requested to reset your Job Tracker password.</p>
          <p>Click the button below to reset it. This link expires in <strong>15 minutes.</strong></p>
          <a href="${resetURL}"
             style="display: inline-block; margin: 24px 0; padding: 12px 28px;
                    background-color: #0A66C2; color: #fff; border-radius: 8px;
                    text-decoration: none; font-weight: bold;">
            Reset Password
          </a>
          <p style="color: #666; font-size: 13px;">
            If you didn't request this, ignore this email.
            Your password will remain unchanged.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
          <p style="color: #999; font-size: 12px;">Job Tracker — AI Powered Job Search</p>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: `Reset link sent to ${user.email}`
        });

    } catch (error) {
        console.error('Forgot password error:', error.message);
        res.status(500).json({ message: 'Email could not be sent. Try again.' });
    }
});

// PUT /api/auth/reset-password/:token
router.put('/reset-password/:token', async (req, res) => {
    try {
        const { password } = req.body;

        if (!password || password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // 1. Hash the token from URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // 2. Find user with valid token
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Reset link is invalid or has expired. Please request a new one.'
            });
        }

        // 3. Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 4. Clear reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ message: 'Password reset successful! Please login.' });

    } catch (error) {
        console.error('Reset password error:', error.message);
        res.status(500).json({ message: 'Something went wrong. Try again.' });
    }
});
module.exports = router;
const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const protect = require('../middleware/authMiddleware');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Helper function to call Groq
const askGroq = async (prompt) => {
    const completion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
    });
    return completion.choices[0].message.content;
};

// 1. POST /api/ai/cover-letter
router.post('/cover-letter', protect, async (req, res) => {
    try {
        const { company, role, jobDescription, userName } = req.body;

        if (!company || !role || !jobDescription) {
            return res.status(400).json({ message: 'Company, role and job description are required' });
        }

        const prompt = `Write a professional cover letter for the following:

Applicant Name: ${userName}
Company: ${company}
Role: ${role}
Job Description: ${jobDescription}

Requirements:
- Keep it under 300 words
- Professional but personable tone
- 3 paragraphs: introduction, why I am a fit, closing
- Do NOT use generic filler phrases
- Make it specific to the role and company
- End with a strong call to action

Write ONLY the cover letter text, no extra commentary.`;

        const result = await askGroq(prompt);
        res.json({ result });

    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ message: 'AI service failed. Please try again.' });
    }
});

// 2. POST /api/ai/interview-prep
router.post('/interview-prep', protect, async (req, res) => {
    try {
        const { company, role, jobDescription } = req.body;

        if (!company || !role) {
            return res.status(400).json({ message: 'Company and role are required' });
        }

        const prompt = `Generate interview preparation questions for:

Company: ${company}
Role: ${role}
Job Description: ${jobDescription || 'Not provided'}

Provide exactly 10 interview questions in these categories:
1. Technical Skills (3 questions specific to the role)
2. Behavioural (3 questions using STAR method)
3. Company-specific (2 questions about ${company})
4. Role-specific Scenarios (2 situational questions)

For each question also provide:
- A brief tip on how to answer it (1 sentence)

Format as:
**Category Name**
Q1: [question]
Tip: [answer tip]

Write ONLY the questions and tips, no extra commentary.`;

        const result = await askGroq(prompt);
        res.json({ result });

    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ message: 'AI service failed. Please try again.' });
    }
});

// 3. POST /api/ai/followup-email
router.post('/followup-email', protect, async (req, res) => {
    try {
        const { company, role, status, dateApplied, userName } = req.body;

        if (!company || !role || !status) {
            return res.status(400).json({ message: 'Company, role and status are required' });
        }

        const prompt = `Write a professional follow-up email for a job application:

Applicant Name: ${userName}
Company: ${company}
Role: ${role}
Current Status: ${status}
Date Applied: ${dateApplied}

Email guidelines based on status:
- Applied: Follow up after no response
- Interview: Thank you and next steps inquiry
- Written Test: Follow up on test results
- Offered: Professional acceptance or negotiation opener
- Rejected: Graceful response asking for feedback

Requirements:
- Subject line included
- Under 150 words
- Professional and confident tone
- Specific to the company and role
- Clear call to action

Format as:
Subject: [subject line]

[email body]`;

        const result = await askGroq(prompt);
        res.json({ result });

    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ message: 'AI service failed. Please try again.' });
    }
});

// 4. POST /api/ai/resume-tips
router.post('/resume-tips', protect, async (req, res) => {
    try {
        const { company, role, jobDescription } = req.body;

        if (!role || !jobDescription) {
            return res.status(400).json({ message: 'Role and job description are required' });
        }

        const prompt = `Analyze this job description and provide resume optimization tips:

Company: ${company}
Role: ${role}
Job Description: ${jobDescription}

Provide:
1. Top 5 Keywords to include in resume (most important ATS keywords from the JD)
2. Top 5 Skills to highlight prominently
3. 3 Bullet Point Templates showing how to phrase experience for this role
4. What to Remove - 2 things to avoid or remove for this role
5. One Power Tip - the single most important thing to tailor for this application

Be specific, practical, and actionable.
Format with clear headers and bullet points.
Write ONLY the tips, no extra commentary.`;

        const result = await askGroq(prompt);
        res.json({ result });

    } catch (error) {
        console.error('AI Error:', error.message);
        res.status(500).json({ message: 'AI service failed. Please try again.' });
    }
});

module.exports = router;
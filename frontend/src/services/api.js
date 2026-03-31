import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

// Auth routes
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);

// Job routes
export const getJobs = (params) => API.get('/jobs', { params });
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getDashboardStats = () => API.get('/jobs/stats/summary');
// AI routes
export const generateCoverLetter = (data) => API.post('/ai/cover-letter', data);
export const generateInterviewPrep = (data) => API.post('/ai/interview-prep', data);
export const generateFollowupEmail = (data) => API.post('/ai/followup-email', data);
export const generateResumeTips = (data) => API.post('/ai/resume-tips', data);
export const getAnalytics = () => API.get('/jobs/analytics/full');
export const sendWeeklySummaryEmail = () => API.post('/jobs/analytics/send-summary');
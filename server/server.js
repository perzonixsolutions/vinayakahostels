require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
const helmet = require('helmet');
const compression = require('compression');

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', // Allow all if not set (for dev/testing) or specify frontend URL
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', require('./routes/students'));
app.use('/api/hostels', require('./routes/hostels'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/finance', require('./routes/finance'));

// Health Check
app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send('It works!');
});

app.get('/api', (req, res) => {
    res.json({ status: 'ok', message: 'Vinayaka API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

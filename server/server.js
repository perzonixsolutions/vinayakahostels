require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const db = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', require('./routes/students'));
app.use('/api/hostels', require('./routes/hostels'));
app.use('/api/hostels', require('./routes/hostels'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/contact', require('./routes/contact'));

// Health Check
app.get('/', (req, res) => {
    res.send({ status: 'API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

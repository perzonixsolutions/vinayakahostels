const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) {
            return res.status(500).json({ message: 'Database error.' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ message: 'Error checking password.' });

            if (isMatch) {
                const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                return res.json({
                    message: 'Login successful',
                    token,
                    user: { id: user.id, email: user.email, role: user.role }
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }
        });
    });
});

// Get Current User (Protected)
router.get('/me', verifyToken, (req, res) => {
    res.json({ user: req.user });
});

module.exports = router;

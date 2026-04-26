const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// Get all transactions
router.get('/', verifyToken, (req, res) => {
    const query = "SELECT * FROM transactions ORDER BY created_at DESC";

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
});

// Add a transaction
router.post('/', verifyToken, (req, res) => {
    const { type, category, amount, description, date } = req.body;

    // Minimal validation
    if (!type || !amount) {
        return res.status(400).json({ message: 'Type and amount are required' });
    }

    const sql = `INSERT INTO transactions (type, category, amount, description, date) VALUES (?, ?, ?, ?, ?)`;
    const params = [type, category || '', amount, description || '', date || new Date().toISOString().split('T')[0]];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error adding transaction', error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Transaction added successfully' });
    });
});

// Delete a transaction
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM transactions WHERE id = ?";

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting transaction', error: err.message });
        }

        // MySQL uses effectedRows inside the adapter, sqlite uses changes
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.json({ message: 'Transaction deleted successfully' });
    });
});

module.exports = router;

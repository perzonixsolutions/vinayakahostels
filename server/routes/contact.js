const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// POST /api/contact - Submit a new contact message
router.post('/', (req, res) => {
    const { name, email, phone, message, preferredDate } = req.body;

    if (!name || !email || !phone || !message) {
        return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    const sql = `INSERT INTO contacts (name, email, phone, message, preferred_date) VALUES (?, ?, ?, ?, ?)`;
    const params = [name, email, phone, message, preferredDate || null];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error saving contact message:', err.message);
            return res.status(500).json({ message: 'Failed to save message.' });
        }
        res.status(201).json({ message: 'Message sent successfully.', id: this.lastID });
    });
});

// GET /api/contact - Get all messages (Admin only)
router.get('/', verifyToken, (req, res) => {
    const sql = `SELECT * FROM contacts ORDER BY submitted_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving messages:', err.message);
            return res.status(500).json({ message: 'Failed to retrieve messages.' });
        }
        res.json(rows);
    });
});

// PATCH /api/contact/:id - Update message status (Admin only)
router.patch('/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    // Logic for handling status changes with history
    db.get('SELECT status FROM contacts WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error.' });
        if (!row) return res.status(404).json({ message: 'Message not found.' });

        const currentStatus = row.status;
        let sql, params;

        if (status === 'deleted') {
            // Soft delete: Save current status as previous_status
            sql = 'UPDATE contacts SET status = ?, previous_status = ? WHERE id = ?';
            params = ['deleted', currentStatus, id];
        } else if (status === 'restore') {
            // Restore: Use previous_status if available, otherwise default to 'new'
            // We need to fetch previous_status first if we want to be 100% sure, but we can do it in one query if we trust previous_status is set.
            // However, to be safe, let's fetch it first or use a conditional update if supported (SQLite has IIF but basic SQL is portable).
            // Let's simplified: If status is 'restore', we need to look up previous_status.

            db.get('SELECT previous_status FROM contacts WHERE id = ?', [id], (err, row) => {
                if (err) return res.status(500).json({ message: 'Database error.' });

                const targetStatus = row.previous_status || 'new'; // Default to new if no history
                const updateSql = 'UPDATE contacts SET status = ?, previous_status = NULL WHERE id = ?';

                db.run(updateSql, [targetStatus, id], function (err) {
                    if (err) {
                        console.error('Error restoring message:', err.message);
                        return res.status(500).json({ message: 'Failed to restore message.' });
                    }
                    res.json({ message: `Message restored to ${targetStatus}.`, newStatus: targetStatus });
                });
            });
            return; // Exit here as the inner callback handles the response
        } else {
            // Normal status update (e.g. new -> read)
            sql = 'UPDATE contacts SET status = ? WHERE id = ?';
            params = [status, id];
        }

        db.run(sql, params, function (err) {
            if (err) {
                console.error('Error updating message status:', err.message);
                return res.status(500).json({ message: 'Failed to update status.' });
            }
            res.json({ message: 'Status updated successfully.' });
        });
    });
});

// DELETE /api/contact/:id - Permanently delete message (Admin only)
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM contacts WHERE id = ?';
    db.run(sql, [id], function (err) {
        if (err) {
            console.error('Error deleting message:', err.message);
            return res.status(500).json({ message: 'Failed to delete message.' });
        }
        res.json({ message: 'Message permanently deleted.' });
    });
});

// POST /api/contact/bulk-update - Bulk operations (Admin only)
router.post('/bulk-update', verifyToken, (req, res) => {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'IDs array is required.' });
    }
    if (!action) {
        return res.status(400).json({ message: 'Action is required.' });
    }

    const placeholders = ids.map(() => '?').join(',');

    if (action === 'delete') {
        // Bulk Soft Delete: Update status to 'deleted', set previous_status = current status
        // SQLite doesn't support UPDATE FROM elegantly in older versions, but we can do a simple update if we don't care about saving distinct previous_statuses correctly in a bulk op...
        // WAIT. If we bulk delete 'new' and 'read' messages, we lose their individual history if we just set previous_status='read' for all.
        // Correct way is to update each one. But for bulk, maybe we can accept a slight limitation or use a transaction.
        // Better approach:
        // UPDATE contacts SET previous_status = status, status = 'deleted' WHERE id IN (...)
        // This works perfectly in SQL to preserve each row's current status!

        const sql = `UPDATE contacts SET previous_status = status, status = 'deleted' WHERE id IN (${placeholders})`;
        db.run(sql, ids, function (err) {
            if (err) {
                console.error('Error bulk deleting:', err.message);
                return res.status(500).json({ message: 'Failed to delete messages.' });
            }
            res.json({ message: 'Messages moved to trash.' });
        });

    } else if (action === 'restore') {
        // Bulk Restore: UPDATE contacts SET status = COALESCE(previous_status, 'new'), previous_status = NULL WHERE id IN (...)
        const sql = `UPDATE contacts SET status = COALESCE(previous_status, 'new'), previous_status = NULL WHERE id IN (${placeholders})`;
        db.run(sql, ids, function (err) {
            if (err) {
                console.error('Error bulk restoring:', err.message);
                return res.status(500).json({ message: 'Failed to restore messages.' });
            }
            res.json({ message: 'Messages restored.' });
        });

    } else if (action === 'permanent_delete') {
        const sql = `DELETE FROM contacts WHERE id IN (${placeholders})`;
        db.run(sql, ids, function (err) {
            if (err) {
                console.error('Error bulk permanent delete:', err.message);
                return res.status(500).json({ message: 'Failed to permanently delete messages.' });
            }
            res.json({ message: 'Messages permanently deleted.' });
        });

    } else {
        res.status(400).json({ message: 'Invalid action.' });
    }
});

// GET /api/contact/stats - Get contact stats (unread count, recent messages)
router.get('/stats', verifyToken, (req, res) => {
    const stats = {
        unreadCount: 0,
        recentMessages: []
    };

    // Get unread count
    db.get("SELECT COUNT(*) as count FROM contacts WHERE status = 'new'", (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        stats.unreadCount = row.count;

        // Get recent 5 messages
        db.all("SELECT * FROM contacts ORDER BY submitted_at DESC LIMIT 5", (err, rows) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            stats.recentMessages = rows;
            res.json(stats);
        });
    });
});

module.exports = router;

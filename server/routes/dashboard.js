const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// GET /api/dashboard/stats
router.get('/stats', verifyToken, (req, res) => {
    const stats = {
        totalRooms: 0,
        totalBeds: 0,
        totalStudents: 0,
        bedsOccupied: 0,
        vacantBeds: 0,
        revenue: 0,
        pendingFees: 0
    };

    // Use Promise.all to run queries in parallel (simulated with callbacks here for SQLite)
    // We'll nest them or use a serialized flow since sqlite3 is callback-based.

    const queries = [
        // 1. Room Stats
        new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count, SUM(capacity) as capacity, SUM(current_occupancy) as occupancy FROM rooms", (err, row) => {
                if (err) reject(err);
                else {
                    stats.totalRooms = row.count || 0;
                    stats.totalBeds = row.capacity || 0;
                    stats.bedsOccupied = row.occupancy || 0;
                    stats.vacantBeds = stats.totalBeds - stats.bedsOccupied;
                    resolve();
                }
            });
        }),
        // 2. Student Stats
        new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count, SUM(fee_paid) as revenue, SUM(fee_due) as pending FROM students", (err, row) => {
                if (err) reject(err);
                else {
                    stats.totalStudents = row.count || 0;
                    stats.revenue = row.revenue || 0;
                    stats.pendingFees = row.pending || 0;
                    resolve();
                }
            });
        })
    ];

    Promise.all(queries)
        .then(() => {
            res.json(stats);
        })
        .catch(err => {
            console.error('Error fetching dashboard stats:', err);
            res.status(500).json({ message: 'Error fetching statistics' });
        });
});

module.exports = router;

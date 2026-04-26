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

    // Use Promise.all to run queries in parallel
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
        // 2. Student Stats (Active only)
        new Promise((resolve, reject) => {
            db.get("SELECT COUNT(*) as count, SUM(fee_due) as pending FROM students WHERE status = 'Active'", (err, row) => {
                if (err) reject(err);
                else {
                    stats.totalStudents = row.count || 0;
                    stats.pendingFees = row.pending || 0;
                    resolve();
                }
            });
        }),
        // 3. Student Revenue (All past & present students)
        new Promise((resolve, reject) => {
            db.get("SELECT SUM(fee_paid) as student_revenue FROM students", (err, row) => {
                if (err) reject(err);
                else {
                    stats.revenue = row.student_revenue || 0;
                    resolve();
                }
            });
        }),
        // 4. Transactions (Misc Income & Expenses)
        new Promise((resolve, reject) => {
            db.all("SELECT type, SUM(amount) as total FROM transactions GROUP BY type", [], (err, rows) => {
                if (err) reject(err);
                else {
                    let miscIncome = 0;
                    let expenses = 0;
                    rows.forEach(r => {
                        if (r.type === 'Income') miscIncome = r.total || 0;
                        if (r.type === 'Expense') expenses = r.total || 0;
                    });
                    stats.revenue += miscIncome;
                    stats.totalExpenses = expenses;
                    resolve();
                }
            });
        })
    ];

    Promise.all(queries)
        .then(() => {
            // Calculate Net Profit
            stats.netProfit = stats.revenue - (stats.totalExpenses || 0);
            res.json(stats);
        })
        .catch(err => {
            console.error('Error fetching dashboard stats:', err);
            res.status(500).json({ message: 'Error fetching statistics' });
        });
});

module.exports = router;

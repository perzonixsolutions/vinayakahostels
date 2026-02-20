const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// Get all students
router.get('/', verifyToken, (req, res) => {
    const { status } = req.query;
    let query = "SELECT students.*, rooms.room_number, blocks.name as block_name FROM students LEFT JOIN rooms ON students.room_id = rooms.id LEFT JOIN blocks ON rooms.block_id = blocks.id";
    const params = [];

    if (status) {
        if (status === 'due') {
            query += " WHERE fee_due > 0";
        } else if (status === 'paid') {
            query += " WHERE fee_due = 0";
        }
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        res.json(rows);
    });
});

// Add a new student
router.post('/', verifyToken, (req, res) => {
    const { name, email, phone, aadhaar, parent_name, parent_phone, address, room_id, rent_total, rent_paid, join_date, rent_cycle } = req.body;

    // Calculate rent_due (formerly fee_due)
    // We are mapping frontend 'rent_total' -> db 'fee_total' for now to avoid full DB migration
    // Or closer mapping: fee_total = rent_total
    const fee_total = rent_total;
    const fee_paid = rent_paid;
    const fee_due = (parseInt(fee_total) || 0) - (parseInt(fee_paid) || 0);

    const sql = `INSERT INTO students (name, email, phone, aadhaar, parent_name, parent_phone, address, room_id, fee_total, fee_paid, fee_due, join_date, rent_cycle) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [name, email, phone, aadhaar, parent_name, parent_phone, address, room_id, fee_total, fee_paid, fee_due, join_date, rent_cycle || 'Monthly'];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ message: 'Error adding student', error: err.message });
        }

        // Update room occupancy
        if (room_id) {
            db.run("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE id = ?", [room_id]);
        }

        res.status(201).json({ id: this.lastID, message: 'Student added successfully' });
    });
});

// Update a student
router.put('/:id', verifyToken, (req, res) => {
    const studentId = req.params.id;
    const { name, email, phone, aadhaar, parent_name, parent_phone, address, room_id, rent_total, rent_paid, rent_cycle, status } = req.body;

    // Get current student data to check for room change
    db.get("SELECT * FROM students WHERE id = ?", [studentId], (err, currentStudent) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        if (!currentStudent) return res.status(404).json({ message: 'Student not found' });

        const oldRoomId = currentStudent.room_id;
        const newRoomId = room_id ? parseInt(room_id) : null;

        // Recalculate fees
        const fee_total = rent_total !== undefined ? rent_total : currentStudent.fee_total;
        const fee_paid = rent_paid !== undefined ? rent_paid : currentStudent.fee_paid;
        const fee_due = (parseInt(fee_total) || 0) - (parseInt(fee_paid) || 0);

        const sql = `UPDATE students SET 
            name = ?, email = ?, phone = ?, aadhaar = ?, 
            parent_name = ?, parent_phone = ?, address = ?, 
            room_id = ?, fee_total = ?, fee_paid = ?, fee_due = ?, 
            rent_cycle = ?, status = ?
            WHERE id = ?`;

        const params = [
            name || currentStudent.name,
            email || currentStudent.email,
            phone || currentStudent.phone,
            aadhaar || currentStudent.aadhaar,
            parent_name || currentStudent.parent_name,
            parent_phone || currentStudent.parent_phone,
            address || currentStudent.address,
            newRoomId,
            fee_total,
            fee_paid,
            fee_due,
            rent_cycle || currentStudent.rent_cycle,
            status || currentStudent.status,
            studentId
        ];

        db.run(sql, params, function (err) {
            if (err) return res.status(500).json({ message: 'Error updating student', error: err.message });

            // Handle Room Occupancy if room changed
            if (oldRoomId !== newRoomId) {
                // Decrease occupancy of old room
                if (oldRoomId) {
                    db.run("UPDATE rooms SET current_occupancy = MAX(0, current_occupancy - 1) WHERE id = ?", [oldRoomId]);
                }
                // Increase occupancy of new room
                if (newRoomId) {
                    db.run("UPDATE rooms SET current_occupancy = current_occupancy + 1 WHERE id = ?", [newRoomId]);
                }
            }

            res.json({ message: 'Student updated successfully' });
        });
    });
});

// Get Stats
router.get('/stats', verifyToken, (req, res) => {
    const stats = {
        totalStudents: 0,
        feeDueCount: 0,
        feePaidCount: 0
    };

    db.get("SELECT COUNT(*) as count FROM students", (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        stats.totalStudents = row.count;

        db.get("SELECT COUNT(*) as count FROM students WHERE fee_due > 0", (err, row) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            stats.feeDueCount = row.count;

            db.get("SELECT COUNT(*) as count FROM students WHERE fee_due = 0", (err, row) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                stats.feePaidCount = row.count;

                res.json(stats);
            });
        });
    });
});

module.exports = router;

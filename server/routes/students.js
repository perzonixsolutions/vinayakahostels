const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// Utility to sync room occupancy
const syncRoomOccupancy = (roomId) => {
    if (!roomId) return;
    const sql = `
        UPDATE rooms 
        SET current_occupancy = (
            SELECT COUNT(*) 
            FROM students 
            WHERE room_id = ? AND status = 'Active'
        ) 
        WHERE id = ?
    `;
    db.run(sql, [roomId, roomId], (err) => {
        if (err) console.error(`Error syncing occupancy for room ${roomId}:`, err.message);
    });
};

// Get all students
router.get('/', verifyToken, (req, res) => {
    const { status } = req.query;
    let query = "SELECT students.*, rooms.room_number, blocks.name as block_name FROM students LEFT JOIN rooms ON students.room_id = rooms.id LEFT JOIN blocks ON rooms.block_id = blocks.id";
    const params = [];

    if (status === 'inactive') {
        query += " WHERE students.status = 'Inactive'";
    } else {
        query += " WHERE students.status = 'Active'";
        if (status === 'due') {
            query += " AND fee_due > 0";
        } else if (status === 'paid') {
            query += " AND fee_due = 0";
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

        if (room_id) {
            syncRoomOccupancy(room_id);
        }

        res.status(201).json({ id: this.lastID, message: 'Student added successfully' });
    });
});

// Update a student
router.put('/:id', verifyToken, (req, res) => {
    const studentId = req.params.id;
    const { name, email, phone, aadhaar, parent_name, parent_phone, address, room_id, rent_total, rent_paid, rent_cycle, status } = req.body;

    db.get("SELECT * FROM students WHERE id = ?", [studentId], (err, currentStudent) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        if (!currentStudent) return res.status(404).json({ message: 'Student not found' });

        const oldRoomId = currentStudent.room_id;
        const newRoomId = room_id !== undefined ? (room_id ? parseInt(room_id) : null) : oldRoomId;

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

            // Always sync rooms involved
            if (oldRoomId) syncRoomOccupancy(oldRoomId);
            if (newRoomId && newRoomId !== oldRoomId) syncRoomOccupancy(newRoomId);

            res.json({ message: 'Student updated successfully' });
        });
    });
});

// Delete a student
router.delete('/:id', verifyToken, (req, res) => {
    const studentId = req.params.id;

    db.get("SELECT room_id FROM students WHERE id = ?", [studentId], (err, student) => {
        if (err) return res.status(500).json({ message: 'Database error', error: err.message });
        if (!student) return res.status(404).json({ message: 'Student not found' });

        const roomId = student.room_id;

        db.run("DELETE FROM students WHERE id = ?", [studentId], function (err) {
            if (err) return res.status(500).json({ message: 'Error deleting student', error: err.message });

            if (roomId) {
                syncRoomOccupancy(roomId);
            }

            res.json({ message: 'Student deleted successfully' });
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

    db.get("SELECT COUNT(*) as count FROM students WHERE status = 'Active'", (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        stats.totalStudents = row.count;

        db.get("SELECT COUNT(*) as count FROM students WHERE status = 'Active' AND fee_due > 0", (err, row) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            stats.feeDueCount = row.count;

            db.get("SELECT COUNT(*) as count FROM students WHERE status = 'Active' AND fee_due = 0", (err, row) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                stats.feePaidCount = row.count;

                res.json(stats);
            });
        });
    });
});

module.exports = router;

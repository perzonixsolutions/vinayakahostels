const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');

// Get all blocks
router.get('/blocks', verifyToken, (req, res) => {
    db.all("SELECT * FROM blocks", (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

// Add a block
router.post('/blocks', verifyToken, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Block name is required' });

    db.run("INSERT INTO blocks (name) VALUES (?)", [name], function (err) {
        if (err) return res.status(500).json({ message: 'Error adding block', error: err.message });
        res.status(201).json({ id: this.lastID, name });
    });
});

// Get rooms for a block
router.get('/blocks/:id/rooms', verifyToken, (req, res) => {
    const blockId = req.params.id;
    db.all("SELECT * FROM rooms WHERE block_id = ?", [blockId], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

// Add a room
router.post('/rooms', verifyToken, (req, res) => {
    const { block_id, room_number, capacity, type } = req.body;

    /*
     * We need to validate that room_number is unique within the block.
     * The database schema should enforce UNIQUE(block_id, room_number),
     * but we also handle the error gracefully here.
     */

    db.run("INSERT INTO rooms (block_id, room_number, capacity, type) VALUES (?, ?, ?, ?)",
        [block_id, room_number, capacity, type || 'Non-AC'],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ message: 'Room number already exists in this block' });
                }
                return res.status(500).json({ message: 'Error adding room', error: err.message });
            }
            res.status(201).json({ id: this.lastID, message: 'Room added successfully' });
        });
});

// Get Stats
router.get('/stats', verifyToken, (req, res) => {
    db.all("SELECT capacity, current_occupancy FROM rooms", (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const totalCapacity = rows.reduce((acc, room) => acc + room.capacity, 0);
        const totalOccupancy = rows.reduce((acc, room) => acc + room.current_occupancy, 0);
        const availableBeds = totalCapacity - totalOccupancy;

        res.json({
            totalCapacity,
            totalOccupancy,
            availableBeds
        });
    });
});

module.exports = router;

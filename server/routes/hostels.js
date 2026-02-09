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
    const { block_id, room_number, capacity, type, name, price_monthly, price_semester, image_url, description, amenities, is_visible } = req.body;

    const sql = `INSERT INTO rooms (
        block_id, room_number, capacity, type, name, price_monthly, price_semester, image_url, description, amenities, is_visible
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        block_id,
        room_number,
        capacity,
        type || 'Non-AC',
        name,
        price_monthly,
        price_semester,
        image_url,
        description,
        amenities,
        is_visible ? 1 : 0
    ];

    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(400).json({ message: 'Room number already exists in this block' });
            }
            return res.status(500).json({ message: 'Error adding room', error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Room added successfully' });
    });
});

// Get Public Rooms
router.get('/public', (req, res) => {
    const sql = `
        SELECT rooms.*, blocks.name as block_name 
        FROM rooms 
        JOIN blocks ON rooms.block_id = blocks.id 
        WHERE is_visible = 1
    `;
    db.all(sql, (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // Map rows to match frontend structure if needed, or just return as is
        // Frontend expects: _id (we send id), roomName (we send name), etc.
        // We can do mapping here or in frontend. Let's send raw and handle mapping in frontend.
        res.json(rows);
    });
});

// Get Single Public Room
router.get('/public/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT rooms.*, blocks.name as block_name 
        FROM rooms 
        JOIN blocks ON rooms.block_id = blocks.id 
        WHERE rooms.id = ? AND is_visible = 1
    `;
    db.get(sql, [id], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!row) return res.status(404).json({ message: 'Room not found' });
        res.json(row);
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

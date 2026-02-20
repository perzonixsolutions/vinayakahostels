const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

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
router.post('/rooms', verifyToken, upload.single('image'), (req, res) => {
    const { block_id, room_number, capacity, type, name, price_monthly, price_semester, description, amenities, is_visible } = req.body;

    let image_url = '';
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

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
        is_visible === 'true' || is_visible === true ? 1 : 0
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

// Delete a block
router.delete('/blocks/:id', verifyToken, (req, res) => {
    const blockId = req.params.id;

    // Check if block has rooms
    db.get("SELECT COUNT(*) as count FROM rooms WHERE block_id = ?", [blockId], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (row.count > 0) {
            return res.status(400).json({ message: 'Cannot delete block with existing rooms. Delete rooms first.' });
        }

        db.run("DELETE FROM blocks WHERE id = ?", [blockId], function (err) {
            if (err) return res.status(500).json({ message: 'Error deleting block', error: err.message });
            if (this.changes === 0) return res.status(404).json({ message: 'Block not found' });
            res.json({ message: 'Block deleted successfully' });
        });
    });
});

// Delete a room
router.delete('/rooms/:id', verifyToken, (req, res) => {
    const roomId = req.params.id;

    // Check if room is occupied (has students)
    db.get("SELECT current_occupancy FROM rooms WHERE id = ?", [roomId], (err, row) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!row) return res.status(404).json({ message: 'Room not found' });

        if (row.current_occupancy > 0) {
            return res.status(400).json({ message: 'Cannot delete occupied room. Reassign or remove students first.' });
        }

        db.run("DELETE FROM rooms WHERE id = ?", [roomId], function (err) {
            if (err) return res.status(500).json({ message: 'Error deleting room', error: err.message });
            res.json({ message: 'Room deleted successfully' });
        });
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

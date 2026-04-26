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

// Add a room
router.post('/rooms', verifyToken, upload.array('images', 10), (req, res) => {
    const { block_id, room_number, capacity, type, name, price_monthly, price_semester, description, amenities, is_visible } = req.body;

    const sql = `INSERT INTO rooms (
        block_id, room_number, capacity, type, name, price_monthly, price_semester, description, amenities, is_visible
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        block_id,
        room_number,
        capacity,
        type || 'Non-AC',
        name,
        price_monthly,
        price_semester,
        description,
        amenities,
        is_visible === 'true' || is_visible === true ? 1 : 0
    ];

    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed') || err.message.includes('Duplicate entry')) {
                return res.status(400).json({ message: 'Room number already exists in this block' });
            }
            return res.status(500).json({ message: 'Error adding room', error: err.message });
        }

        const roomId = this.lastID;

        // Add multiple images
        if (req.files && req.files.length > 0) {
            const imageQueries = req.files.map(file => {
                const image_url = `/uploads/${file.filename}`;
                return new Promise((resolve, reject) => {
                    db.run("INSERT INTO room_images (room_id, image_url) VALUES (?, ?)", [roomId, image_url], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });

            Promise.all(imageQueries)
                .then(() => {
                    res.status(201).json({ id: roomId, message: 'Room and images added successfully' });
                })
                .catch(imageErr => {
                    res.status(201).json({ id: roomId, message: 'Room added, but some images failed to save', error: imageErr.message });
                });
        } else {
            res.status(201).json({ id: roomId, message: 'Room added successfully (no images)' });
        }
    });
});

// Get rooms for a block with images
router.get('/blocks/:id/rooms', verifyToken, (req, res) => {
    const blockId = req.params.id;
    const sql = "SELECT * FROM rooms WHERE block_id = ?";

    db.all(sql, [blockId], (err, rooms) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        // Get images for each room
        const roomIds = rooms.map(r => r.id);
        if (roomIds.length === 0) return res.json([]);

        const placeholders = roomIds.map(() => '?').join(',');
        db.all(`SELECT * FROM room_images WHERE room_id IN (${placeholders})`, roomIds, (err, images) => {
            if (err) return res.status(500).json({ message: 'Error fetching room images' });

            const roomsWithImages = rooms.map(room => ({
                ...room,
                images: images.filter(img => img.room_id === room.id).map(img => img.image_url)
            }));

            res.json(roomsWithImages);
        });
    });
});

// Get Public Rooms with images
router.get('/public', (req, res) => {
    const sql = `
        SELECT rooms.*, blocks.name as block_name 
        FROM rooms 
        JOIN blocks ON rooms.block_id = blocks.id 
        WHERE is_visible = 1
    `;
    db.all(sql, (err, rooms) => {
        if (err) return res.status(500).json({ message: 'Database error' });

        const roomIds = rooms.map(r => r.id);
        if (roomIds.length === 0) return res.json([]);

        const placeholders = roomIds.map(() => '?').join(',');
        db.all(`SELECT * FROM room_images WHERE room_id IN (${placeholders})`, roomIds, (err, images) => {
            if (err) return res.status(500).json({ message: 'Error fetching room images' });

            const roomsWithImages = rooms.map(room => ({
                ...room,
                images: images.filter(img => img.room_id === room.id).map(img => img.image_url)
            }));

            res.json(roomsWithImages);
        });
    });
});

// Get Single Public Room with images
router.get('/public/:id', (req, res) => {
    const id = req.params.id;
    const sql = `
        SELECT rooms.*, blocks.name as block_name 
        FROM rooms 
        JOIN blocks ON rooms.block_id = blocks.id 
        WHERE rooms.id = ? AND is_visible = 1
    `;
    db.get(sql, [id], (err, room) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        if (!room) return res.status(404).json({ message: 'Room not found' });

        db.all("SELECT image_url FROM room_images WHERE room_id = ?", [id], (err, images) => {
            if (err) return res.status(500).json({ message: 'Error fetching room images' });
            room.images = images.map(img => img.image_url);
            res.json(room);
        });
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

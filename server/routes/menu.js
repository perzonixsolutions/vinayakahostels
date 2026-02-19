const express = require('express');
const router = express.Router();
const db = require('../db/database');
const verifyToken = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all menu items
router.get('/', (req, res) => {
    db.all("SELECT * FROM menu_items", (err, rows) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(rows);
    });
});

// Add a menu item
router.post('/', verifyToken, upload.single('image'), (req, res) => {
    console.log('Received Add Menu Item Request');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { meal_type, name, description, price, is_available, day_of_week } = req.body;

    let image_url = '';
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    // Map frontend fields (image_url, is_available) to DB columns (image, is_active)
    const sql = `INSERT INTO menu_items (meal_type, name, description, price, image, is_active, day_of_week) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const params = [meal_type, name, description, price, image_url, is_available ? 1 : 0, day_of_week];

    db.run(sql, params, function (err) {
        if (err) {
            console.error('Error adding menu item to DB:', err.message);
            console.error('SQL params:', params);
            return res.status(500).json({ message: 'Error adding menu item', error: err.message });
        }
        console.log('Menu item added successfully, ID:', this.lastID);
        res.status(201).json({ id: this.lastID, message: 'Menu item added successfully' });
    });
});

// Delete a menu item
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM menu_items WHERE id = ?", [id], function (err) {
        if (err) return res.status(500).json({ message: 'Error deleting menu item' });
        res.json({ message: 'Menu item deleted successfully' });
    });
});

module.exports = router;

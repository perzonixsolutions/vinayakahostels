const express = require('express');
const router = express.Router();
const db = require('../db/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/gallery';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

// GET all gallery items
router.get('/', (req, res) => {
    const sql = "SELECT * FROM gallery ORDER BY display_order ASC, created_at DESC";

    // Check if we are using the custom DB adapter (MySQL) or SQLite
    if (db.all) {
        db.all(sql, [], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json(rows);
        });
    } else {
        // Fallback or if structure is different
        res.status(500).json({ error: 'Database connection error' });
    }
});

// POST new gallery item
router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Image is required' });
    }

    const { category, title, description, display_order } = req.body;
    const imagePath = `/uploads/gallery/${req.file.filename}`;

    const sql = "INSERT INTO gallery (category, title, image, description, display_order) VALUES (?, ?, ?, ?, ?)";
    const params = [category, title, imagePath, description, display_order || 0];

    db.run(sql, params, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            id: this.lastID, // SQLite/MySQL adapter compatible
            category,
            title,
            image: imagePath,
            description,
            display_order
        });
    });
});

// DELETE gallery item
router.delete('/:id', (req, res) => {
    const id = req.params.id;

    // First get the image path to delete the file
    db.get("SELECT image FROM gallery WHERE id = ?", [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Item not found' });

        const imagePath = row.image;

        db.run("DELETE FROM gallery WHERE id = ?", [id], function (err) {
            if (err) return res.status(500).json({ error: err.message });

            // Delete file from filesystem
            if (imagePath) {
                const absolutePath = path.join(__dirname, '../../', imagePath);
                if (fs.existsSync(absolutePath)) {
                    fs.unlinkSync(absolutePath);
                }
            }

            res.json({ message: 'Gallery item deleted successfully' });
        });
    });
});

module.exports = router;

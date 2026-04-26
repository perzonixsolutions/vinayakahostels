const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db/database');

console.log('--- Database Migration: Creating room_images table ---');

const DB_TYPE = process.env.DB_TYPE || (process.env.DB_USER ? 'mysql' : 'sqlite');
console.log(`Detected DB Type: ${DB_TYPE}`);

const sql = DB_TYPE === 'mysql' 
    ? `CREATE TABLE IF NOT EXISTS room_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        room_id INT,
        image_url TEXT NOT NULL,
        FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE
    )`
    : `CREATE TABLE IF NOT EXISTS room_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        room_id INTEGER,
        image_url TEXT NOT NULL,
        FOREIGN KEY(room_id) REFERENCES rooms(id) ON DELETE CASCADE
    )`;

async function migrate() {
    try {
        await new Promise((resolve, reject) => {
            db.run(sql, [], (err) => {
                if (err) return reject(err);
                resolve();
            });
        });
        console.log('  room_images table created or already exists.');

        // Optional: Migrate existing room images if any
        // Since we only had one image_url before, we can copy it to room_images
        console.log('  Migrating existing room images...');
        const rooms = await new Promise((resolve, reject) => {
            db.all("SELECT id, image_url FROM rooms WHERE image_url IS NOT NULL AND image_url != ''", (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });

        for (const room of rooms) {
            // Check if already migrated
            const exists = await new Promise((resolve, reject) => {
                db.get("SELECT id FROM room_images WHERE room_id = ? AND image_url = ?", [room.id, room.image_url], (err, row) => {
                    if (err) return reject(err);
                    resolve(row);
                });
            });

            if (!exists) {
                await new Promise((resolve, reject) => {
                    db.run("INSERT INTO room_images (room_id, image_url) VALUES (?, ?)", [room.id, room.image_url], (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
                console.log(`    Migrated image for Room ID ${room.id}`);
            }
        }

    } catch (error) {
        console.error('  Migration Error:', error.message);
    }

    console.log('--- Migration Complete ---');
    process.exit(0);
}

migrate();

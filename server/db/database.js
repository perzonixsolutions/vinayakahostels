const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const path = require('path');

const dbPath = path.resolve(__dirname, '../hostel.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Create Admin Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin'
        )`);

        // Create Blocks Table
        db.run(`CREATE TABLE IF NOT EXISTS blocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);

        // Create Rooms Table
        db.run(`CREATE TABLE IF NOT EXISTS rooms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            block_id INTEGER,
            room_number TEXT NOT NULL,
            capacity INTEGER NOT NULL,
            current_occupancy INTEGER DEFAULT 0,
            type TEXT DEFAULT 'Non-AC',
            FOREIGN KEY(block_id) REFERENCES blocks(id),
            UNIQUE(block_id, room_number)
        )`);

        // Create Students Table
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT NOT NULL,
            aadhaar TEXT UNIQUE,
            parent_name TEXT,
            parent_phone TEXT,
            address TEXT,
            room_id INTEGER,
            fee_total INTEGER DEFAULT 0,
            fee_paid INTEGER DEFAULT 0,
            fee_due INTEGER DEFAULT 0,
            join_date TEXT,
            status TEXT DEFAULT 'Active',
            FOREIGN KEY(room_id) REFERENCES rooms(id)
        )`);

        // Create Contacts Table
        db.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT NOT NULL,
            preferred_date TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'new',
            previous_status TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating tables:', err.message);
            } else {
                console.log('Tables initialized.');
                seedAdmin();
                seedHostelData();
            }
        });
    });
}

function seedAdmin() {
    const adminEmail = 'admin@vinayaka.com';
    const adminPassword = 'admin123';
    const saltRounds = 10;

    db.get("SELECT * FROM users WHERE email = ?", [adminEmail], (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (!row) {
            bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return;
                }

                db.run("INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
                    [adminEmail, hash, 'admin'],
                    (err) => {
                        if (err) {
                            console.error('Error creating admin user:', err.message);
                        } else {
                            console.log('Default admin user created.');
                        }
                    }
                );
            });
        }
    });
}

function seedHostelData() {
    // Seed Blocks
    const blocks = ['Block A', 'Block B', 'Block C'];
    blocks.forEach(blockName => {
        db.run("INSERT OR IGNORE INTO blocks (name) VALUES (?)", [blockName], function (err) {
            if (err) {
                console.error('Error seeding block:', err.message);
            } else if (this.changes > 0) {
                const blockId = this.lastID;
                // Seed some rooms for this block if it was just created
                // (Simple seeding logic: 10 rooms per block)
                for (let i = 101; i <= 110; i++) {
                    db.run(`INSERT OR IGNORE INTO rooms (block_id, room_number, capacity, type) 
                            VALUES (?, ?, ?, ?)`,
                        [blockId, `${i}`, 3, i % 2 === 0 ? 'AC' : 'Non-AC']);
                }
                console.log(`Seeded ${blockName} with rooms.`);
            }
        });
    });
}

module.exports = db;

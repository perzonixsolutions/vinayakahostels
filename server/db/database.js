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
        // Drop table if exists to ensure schema consistency
        db.run("DROP TABLE IF EXISTS users");

        // Create Admin Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin'
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                seedAdmin();
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

module.exports = db;

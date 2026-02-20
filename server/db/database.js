const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const path = require('path');

let db;
const DB_TYPE = process.env.DB_TYPE || (process.env.DB_USER ? 'mysql' : 'sqlite');

if (DB_TYPE === 'mysql') {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        connectTimeout: 60000, // 60s
        acquireTimeout: 60000  // 60s
    });

    console.log(`Connecting to MySQL Database: ${process.env.DB_NAME} as ${process.env.DB_USER}`);

    // Adapter to mimic sqlite3 API for MySQL
    db = {
        pool: pool,
        serialize: (callback) => callback(), // No-op for MySQL
        run: function (sql, params, callback) {
            // Convert SQLite AUTOINCREMENT to MySQL standard if needed in queries (rarely needed for inserts/updates)
            pool.query(sql, params, function (err, results) {
                if (callback) {
                    // Simulate sqlite3 'this' context properties
                    const context = {
                        lastID: results ? results.insertId : 0,
                        changes: results ? results.affectedRows : 0
                    };
                    callback.call(context, err);
                }
            });
        },
        get: function (sql, params, callback) {
            pool.query(sql, params, function (err, results) {
                if (err) return callback(err);
                // SQLite returns undefined if no row, MySQL returns empty array
                const row = results && results.length > 0 ? results[0] : undefined;
                callback(null, row);
            });
        },
        all: function (sql, params, callback) {
            pool.query(sql, params, function (err, results) {
                callback(err, results);
            });
        }
    };

    initializeMySQL(pool);

} else {
    // SQLite Setup
    const dbPath = path.resolve(__dirname, '../hostel.db');
    const sqliteDb = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error connecting to database:', err.message);
        } else {
            console.log('Connected to SQLite database.');
            initializeSQLite(sqliteDb);
        }
    });
    db = sqliteDb;
}

function initializeMySQL(pool) {
    // MySQL Schema Init
    const queries = [
        `CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'admin'
        )`,
        `CREATE TABLE IF NOT EXISTS blocks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) UNIQUE NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS rooms (
            id INT AUTO_INCREMENT PRIMARY KEY,
            block_id INT,
            room_number VARCHAR(50) NOT NULL,
            capacity INT NOT NULL,
            current_occupancy INT DEFAULT 0,
            type VARCHAR(50) DEFAULT 'Non-AC',
            FOREIGN KEY(block_id) REFERENCES blocks(id),
            UNIQUE(block_id, room_number)
        )`,
        `CREATE TABLE IF NOT EXISTS students (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE,
            phone VARCHAR(50) NOT NULL,
            aadhaar VARCHAR(50) UNIQUE,
            parent_name VARCHAR(255),
            parent_phone VARCHAR(50),
            address TEXT,
            room_id INT,
            fee_total INT DEFAULT 0,
            fee_paid INT DEFAULT 0,
            fee_due INT DEFAULT 0,
            join_date VARCHAR(50),
            status VARCHAR(50) DEFAULT 'Active',
            rent_cycle VARCHAR(50) DEFAULT 'Monthly',
            FOREIGN KEY(room_id) REFERENCES rooms(id)
        )`,
        `CREATE TABLE IF NOT EXISTS contacts (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50) NOT NULL,
            message TEXT NOT NULL,
            preferred_date VARCHAR(50),
            submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status VARCHAR(50) DEFAULT 'new',
            previous_status TEXT
        )`,
        `CREATE TABLE IF NOT EXISTS menu_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price VARCHAR(50),
            meal_type VARCHAR(50),
            day_of_week VARCHAR(50),
            image TEXT,
            is_active BOOLEAN DEFAULT 1
        )`,
        `CREATE TABLE IF NOT EXISTS gallery (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category VARCHAR(50),
            title VARCHAR(255),
            image TEXT NOT NULL,
            description TEXT,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    // Execute queries sequentially
    let p = Promise.resolve();
    queries.forEach(query => {
        p = p.then(() => new Promise((resolve, reject) => {
            pool.query(query, (err) => {
                // Ignore specific errors if table already exists or connection fails (soft fail for init)
                if (err) {
                    console.error('Warning creating table MySQL:', err.code, err.message);
                }
                resolve(); // Always resolve so next query runs
            });
        }));
    });

    p.then(() => {
        console.log('MySQL Tables initialization check complete.');
        // seedAdmin(); // Optional: Call only if needed
        // seedHostelData();
    }).catch(err => {
        console.error('MySQL Initialization critical error:', err);
    });
}


function initializeSQLite(sqliteDb) {
    sqliteDb.serialize(() => {
        // Create Admin Users Table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin'
        )`);

        // Create Blocks Table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS blocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL
        )`);

        // Create Rooms Table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS rooms (
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
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS students (
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
            rent_cycle TEXT DEFAULT 'Monthly',
            FOREIGN KEY(room_id) REFERENCES rooms(id)
        )`);

        // Create Contacts Table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            message TEXT NOT NULL,
            preferred_date TEXT,
            submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'new',
            previous_status TEXT
        )`);

        // Create Menu Items Table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS menu_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price TEXT,
            meal_type TEXT,
            day_of_week TEXT,
            image TEXT,
            is_active BOOLEAN DEFAULT 1
        )`, (err) => {
            if (err) {
                console.error('Error creating tables:', err.message);
            } else {
                console.log('Tables initialized.');
                seedAdmin();
                seedHostelData();
            }
        });

        // Create Gallery Table
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT,
            title TEXT,
            image TEXT NOT NULL,
            description TEXT,
            display_order INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    });
}

function seedAdmin() {
    const adminEmail = 'admin@vinayaka.com';
    const adminPassword = 'admin123';
    const saltRounds = 10;

    const query = "SELECT * FROM users WHERE email = ?";

    db.get(query, [adminEmail], (err, row) => {
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
                    function (err) {
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
    // For MySQL, 'INSERT OR IGNORE' is 'INSERT IGNORE'
    // For SQLite 'INSERT OR IGNORE' is correct.
    // We need to handle dialect diffs if we want to be perfect, or just use try-catch/logic?
    // A simple 'INSERT IGNORE' works in MySQL. SQLite uses 'INSERT OR IGNORE'.

    const insertBlockSql = DB_TYPE === 'mysql'
        ? "INSERT IGNORE INTO blocks (name) VALUES (?)"
        : "INSERT OR IGNORE INTO blocks (name) VALUES (?)";

    const insertRoomSql = DB_TYPE === 'mysql'
        ? "INSERT IGNORE INTO rooms (block_id, room_number, capacity, type) VALUES (?, ?, ?, ?)"
        : "INSERT OR IGNORE INTO rooms (block_id, room_number, capacity, type) VALUES (?, ?, ?, ?)";

    blocks.forEach(blockName => {
        db.run(insertBlockSql, [blockName], function (err) {
            if (err) {
                console.error('Error seeding block:', err.message);
            } else if (this.changes > 0) {
                const blockId = this.lastID;
                if (blockId) {
                    for (let i = 101; i <= 110; i++) {
                        db.run(insertRoomSql,
                            [blockId, `${i}`, 3, i % 2 === 0 ? 'AC' : 'Non-AC']);
                    }
                    console.log(`Seeded ${blockName} with rooms.`);
                }
            }
        });
    });
}

module.exports = db;

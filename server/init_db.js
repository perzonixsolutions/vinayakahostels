const mysql = require('mysql2');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Load .env if available locally, though cPanel provides them

const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
};

console.log('--- Database Initialization Script ---');
console.log(`Target Database: ${config.database}`);
console.log(`User: ${config.user}`);

if (!config.user || !config.database) {
    console.error('ERROR: Missing DB_USER or DB_NAME environment variables.');
    console.log('Usage: DB_USER=... DB_PASS=... DB_NAME=... node init_db.js');
    process.exit(1);
}

const connection = mysql.createConnection(config);

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
    )`
];

connection.connect(async (err) => {
    if (err) {
        console.error('Connection Failed:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL.');

    try {
        // 1. Create Tables
        for (const query of queries) {
            await runQuery(query);
            console.log('Table created/verified.');
        }

        // 2. Seed Admin
        await seedAdmin();

        // 3. Seed Hostel Data
        await seedHostelData();

        console.log('\n--- Initialization Complete ---');
        connection.end();
    } catch (error) {
        console.error('\nInitialization Failed:', error);
        connection.end();
        process.exit(1);
    }
});

function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
}

async function seedAdmin() {
    const adminEmail = 'admin@vinayaka.com';
    const adminPassword = 'admin123';
    const saltRounds = 10;

    const rows = await runQuery("SELECT * FROM users WHERE email = ?", [adminEmail]);
    if (rows.length === 0) {
        console.log('Seeding admin user...');
        const hash = await bcrypt.hash(adminPassword, saltRounds);
        await runQuery("INSERT INTO users (email, password, role) VALUES (?, ?, ?)", [adminEmail, hash, 'admin']);
        console.log('Admin user created.');
    } else {
        console.log('Admin user already exists.');
    }
}

async function seedHostelData() {
    const blocks = ['Block A', 'Block B', 'Block C'];

    for (const blockName of blocks) {
        // Insert Block
        await runQuery("INSERT IGNORE INTO blocks (name) VALUES (?)", [blockName]);

        // Get Block ID
        const rows = await runQuery("SELECT id FROM blocks WHERE name = ?", [blockName]);
        if (rows.length > 0) {
            const blockId = rows[0].id;

            // Check if rooms exist (simple check)
            const roomRows = await runQuery("SELECT COUNT(*) as count FROM rooms WHERE block_id = ?", [blockId]);
            if (roomRows[0].count === 0) {
                console.log(`Seeding rooms for ${blockName}...`);
                for (let i = 101; i <= 110; i++) {
                    await runQuery(
                        "INSERT IGNORE INTO rooms (block_id, room_number, capacity, type) VALUES (?, ?, ?, ?)",
                        [blockId, `${i}`, 3, i % 2 === 0 ? 'AC' : 'Non-AC']
                    );
                }
            } else {
                console.log(`Rooms for ${blockName} already exist.`);
            }
        }
    }
}

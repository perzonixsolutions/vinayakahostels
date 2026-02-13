const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== Vinayaka Hostels Troubleshooting Script ===');

// 1. Check Node Version
console.log(`\n1. Node Log: ${process.version}`);

// 2. Check Environment Variables
console.log('\n2. Environment Variables:');
console.log(`PORT: ${process.env.PORT || 'Not Set (Defaulting to 5001)'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'Not Set'}`);

// 3. Check File Permissions
console.log('\n3. File Permissions:');
const dbPath = path.resolve(__dirname, 'db');
const dbFile = path.join(dbPath, 'hostel.db');

try {
    const stats = fs.statSync(dbPath);
    console.log(`[OK] db directory exists. Mode: ${stats.mode.toString(8)}`);

    // Check if writable
    try {
        fs.accessSync(dbPath, fs.constants.W_OK);
        console.log('[OK] db directory is writable.');
    } catch (e) {
        console.error('[FAIL] db directory is NOT writable. Database creation will fail.');
    }
} catch (e) {
    console.error(`[FAIL] db directory not found at ${dbPath}`);
}

if (fs.existsSync(dbFile)) {
    try {
        fs.accessSync(dbFile, fs.constants.R_OK | fs.constants.W_OK);
        console.log('[OK] hostel.db is readable and writable.');
    } catch (e) {
        console.error('[FAIL] hostel.db exists but is not writable.');
    }
} else {
    console.log('[INFO] hostel.db does not exist yet (will be created).');
}

// 4. Check Module Installation
console.log('\n4. Checking Modules:');
try {
    require('express');
    require('sqlite3');
    require('helmet');
    require('mysql2');
    console.log('[OK] Key modules (express, sqlite3, helmet, mysql2) are loadable.');
} catch (e) {
    console.error(`[FAIL] Module check failed: ${e.message}`);
    console.log('SUGGESTION: Run "npm install" again.');
}

// 5. Database Verification
console.log('\n5. Database Configuration:');
const DB_TYPE = process.env.DB_TYPE || (process.env.DB_USER ? 'mysql' : 'sqlite');
console.log(`Detected DB_TYPE: ${DB_TYPE}`);

if (DB_TYPE === 'mysql') {
    const mysql = require('mysql2');
    const connection = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    console.log('Attempting MySQL Connection...');
    connection.connect((err) => {
        if (err) {
            console.error('[FAIL] MySQL Connection Error:', err.message);
            console.log('Check DB_USER, DB_PASS, DB_NAME environment variables.');
        } else {
            console.log('[OK] Connected to MySQL successfully.');

            // Check for tables
            connection.query('SHOW TABLES', (err, results) => {
                if (err) {
                    console.error('[FAIL] Error listing tables:', err.message);
                } else {
                    console.log('\nExisting Tables:');
                    if (results.length === 0) {
                        console.log('[WARN] No tables found! Database might be empty.');
                    } else {
                        results.forEach(row => {
                            // The key name in row depends on the query, usually `Tables_in_${dbname}`
                            const tableName = Object.values(row)[0];
                            console.log(` - ${tableName}`);
                        });

                        // Check if contacts table exists explicitly
                        const hasContacts = results.some(row => Object.values(row)[0] === 'contacts');
                        if (hasContacts) {
                            console.log('[OK] "contacts" table exists.');
                        } else {
                            console.error('[FAIL] "contacts" table is MISSING.');
                        }
                    }
                }
                connection.end();
            });
        }
    });
} else {
    // SQLite checks already done above in section 3
    console.log('[INFO] Using SQLite (Default).');
}

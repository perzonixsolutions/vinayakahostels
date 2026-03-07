require('dotenv').config();
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const adminEmail = 'admin@vinayaka.com';
const adminPassword = 'admin123';
const saltRounds = 10;

pool.query("SELECT * FROM users WHERE email = ?", [adminEmail], (err, results) => {
    if (err) {
        console.error("Database error:", err);
        process.exit(1);
    }

    if (results.length === 0) {
        bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                process.exit(1);
            }

            pool.query("INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
                [adminEmail, hash, 'admin'],
                function (err) {
                    if (err) {
                        console.error('Error creating admin user:', err.message);
                    } else {
                        console.log('Default admin user created successfully.');
                    }
                    process.exit(0);
                }
            );
        });
    } else {
        console.log("Admin user already exists. Updating password back to default just in case...");
        bcrypt.hash(adminPassword, saltRounds, (err, hash) => {
            pool.query("UPDATE users SET password = ? WHERE email = ?", [hash, adminEmail], (err) => {
                if (err) {
                    console.error("Error updating password:", err);
                } else {
                    console.log("Password reset successfully to admin123");
                }
                process.exit(0);
            });
        });
    }
});

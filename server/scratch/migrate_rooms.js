const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const db = require('../db/database');

console.log('--- Database Migration: Adding missing columns to rooms table ---');

const columnsToAdd = [
    { name: 'name', type_mysql: 'VARCHAR(255)', type_sqlite: 'TEXT' },
    { name: 'price_monthly', type_mysql: 'INT', type_sqlite: 'INTEGER' },
    { name: 'price_semester', type_mysql: 'INT', type_sqlite: 'INTEGER' },
    { name: 'image_url', type_mysql: 'TEXT', type_sqlite: 'TEXT' },
    { name: 'description', type_mysql: 'TEXT', type_sqlite: 'TEXT' },
    { name: 'amenities', type_mysql: 'TEXT', type_sqlite: 'TEXT' },
    { name: 'is_visible', type_mysql: 'BOOLEAN DEFAULT 1', type_sqlite: 'BOOLEAN DEFAULT 1' }
];

const DB_TYPE = process.env.DB_TYPE || (process.env.DB_USER ? 'mysql' : 'sqlite');
console.log(`Detected DB Type: ${DB_TYPE}`);

async function migrate() {
    for (const col of columnsToAdd) {
        const type = DB_TYPE === 'mysql' ? col.type_mysql : col.type_sqlite;
        const sql = `ALTER TABLE rooms ADD COLUMN ${col.name} ${type}`;
        
        console.log(`Adding column ${col.name}...`);
        
        try {
            await new Promise((resolve, reject) => {
                db.run(sql, [], (err) => {
                    if (err) {
                        if (err.message.includes('duplicate column name') || err.message.includes('already exists')) {
                            console.log(`  Column ${col.name} already exists. Skipping.`);
                            return resolve();
                        }
                        return reject(err);
                    }
                    console.log(`  Column ${col.name} added successfully.`);
                    resolve();
                });
            });
        } catch (error) {
            console.error(`  Error adding column ${col.name}:`, error.message);
        }
    }

    console.log('--- Migration Complete ---');
    process.exit(0);
}

migrate();

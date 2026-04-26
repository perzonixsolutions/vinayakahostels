const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db/database');

console.log('--- Syncing Room Occupancy with Student Records ---');

const sql = `
    UPDATE rooms 
    SET current_occupancy = (
        SELECT COUNT(*) 
        FROM students 
        WHERE students.room_id = rooms.id 
        AND students.status = 'Active'
    )
`;

db.run(sql, [], function(err) {
    if (err) {
        console.error('Error syncing occupancy:', err.message);
    } else {
        console.log(`Successfully synced occupancy for ${this.changes || 'all'} rooms.`);
    }
    process.exit(0);
});

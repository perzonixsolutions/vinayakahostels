const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./db/database');

db.get('SELECT * FROM rooms WHERE id = 2', (err, row) => {
    if (err) {
        console.error('Error:', err.message);
    } else {
        console.log('Room 2 Info:', row);
    }
    process.exit(0);
});

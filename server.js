const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create database
const db = new sqlite3.Database('./users.db');

// Create table
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
`);

// Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function (err) {
            if (err) {
                return res.json({ success: false, message: 'Username already exists' });
            }
            res.json({ success: true });
        }
    );
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (row) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: 'Invalid login' });
            }
        }
    );
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
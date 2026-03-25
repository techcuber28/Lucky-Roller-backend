const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Create database
const db = new Database('users.db');

db.prepare(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
)
`).run();

// Signup
app.post('/signup', (req, res) => {
    const { username, password } = req.body;

    try {
        db.prepare(
            'INSERT INTO users (username, password) VALUES (?, ?)'
        ).run(username, password);

        res.json({ success: true });

    } catch (err) {
        res.json({ success: false, message: 'Username already exists' });
    }
});

// Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const row = db.prepare(
        'SELECT * FROM users WHERE username = ? AND password = ?'
    ).get(username, password);

    if (row) {
        res.json({ success: true });
    } else {
        res.json({ success: false, message: 'Invalid login' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
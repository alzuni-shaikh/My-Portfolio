const express = require("express");
const Database = require("better-sqlite3");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
const db = new Database("database.db");

// Create table if not exists
db.prepare(`
    CREATE TABLE IF NOT EXISTS portfolio (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
    )
`).run();

// Insert route
app.post("/submit", (req, res) => {
    const { name, email, message } = req.body;

    const stmt = db.prepare(
        "INSERT INTO portfolio (name, email, message) VALUES (?, ?, ?)"
    );

    stmt.run(name, email, message);

    res.json({ message: "Data saved successfully!" });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create SQLite database
const dbPath = path.join(__dirname, "database.db");
const db = new Database(dbPath);

// Create table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

// Email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Basic email format regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body || {};

  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedEmail = typeof email === "string" ? email.trim() : "";
  const trimmedMessage = typeof message === "string" ? message.trim() : "";

  // Validate required non-empty fields
  if (!trimmedName || !trimmedEmail || !trimmedMessage) {
    return res.status(400).json({
      error: "Please provide a name, email address, and message."
    });
  }

  // Validate email format
  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return res.status(400).json({
      error: "Please provide a valid email address."
    });
  }

  try {
    // Insert into SQLite
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, message)
      VALUES (?, ?, ?)
    `);
    stmt.run(trimmedName, trimmedEmail, trimmedMessage);

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Contact 🚀",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${trimmedName}</p>
        <p><strong>Email:</strong> ${trimmedEmail}</p>
        <p><strong>Message:</strong> ${trimmedMessage}</p>
      `,
    });

    res.json({ success: true, message: "Message saved & email sent!" });

  } catch (error) {
    console.error("Error processing contact submission:", error.message || error);
    res.status(500).json({ error: "Failed to process message. Please try again later." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔥`);
});
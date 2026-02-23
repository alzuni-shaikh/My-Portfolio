require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

// Create SQLite database
const db = new Database("database.db");

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

// Contact route
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Insert into SQLite
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, message)
      VALUES (?, ?, ?)
    `);
    stmt.run(name, email, message);

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "New Portfolio Contact 🚀",
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    res.json({ success: true, message: "Message saved & email sent!" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port 5000 🔥");
});
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    console.log("New Message Received:");
    console.log(name, email, message);

    res.json({ success: "Message received!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
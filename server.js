
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* ===== HOME PAGE ===== */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

/* ===== TOOLS PAGE ===== */
app.get("/tools", (req, res) => {
  res.sendFile(path.join(__dirname, "public/tools.html"));
});

/* ===== API ===== */
app.get("/api/status", (req, res) => {
  res.json({ status: "🚀 PlayZone V9 is running successfully" });
});

/* ===== MONGODB (optional) ===== */
if (process.env.MONGO_URL) {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log("MongoDB error:", err));
}

/* ===== PORT ===== */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});

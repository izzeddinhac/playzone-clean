const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// 🟢 Frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🟢 Fake Database (بسيط كبداية)
let user = {
  balance: 0,
  vip: 0,
  tasksCompleted: 0
};

// 🟢 API - Get User Data
app.get("/api/user", (req, res) => {
  res.json(user);
});

// 🟢 API - Complete Task
app.post("/api/task/complete", (req, res) => {
  user.balance += 1;
  user.tasksCompleted += 1;
  res.json({ message: "Task completed", user });
});

// 🟢 API - Deposit (يدوي)
app.post("/api/deposit", (req, res) => {
  const { amount } = req.body;
  user.balance += Number(amount);
  res.json({ message: "Deposit added", user });
});

// 🟢 API - Withdraw (طلب فقط)
app.post("/api/withdraw", (req, res) => {
  const { amount } = req.body;

  if (amount > user.balance) {
    return res.json({ message: "Not enough balance" });
  }

  user.balance -= Number(amount);
  res.json({ message: "Withdraw request sent", user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("PlayZone running on port " + PORT);
});

const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

/* ================= DB ================= */

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ================= MODELS ================= */

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  password: String,
  balance: { type: Number, default: 0 },
  vip: { type: Number, default: 0 },
  lastClaim: Date
}));

const Deposit = mongoose.model("Deposit", new mongoose.Schema({
  userId: String,
  amount: Number,
  status: { type: String, default: "pending" }
}));

const Withdraw = mongoose.model("Withdraw", new mongoose.Schema({
  userId: String,
  amount: Number,
  wallet: String,
  status: { type: String, default: "pending" }
}));

/* ================= AUTH ================= */

app.post("/api/auth", async (req, res) => {
  const { name, password } = req.body;

  let user = await User.findOne({ name });

  if (!user) {
    const hash = await bcrypt.hash(password, 10);
    user = await User.create({ name, password: hash });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  res.json({ token, user });
});

/* ================= AUTH MIDDLEWARE ================= */

function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

/* ================= USER ================= */

app.get("/api/me", auth, async (req, res) => {
  const user = await User.findById(req.userId);
  res.json(user);
});

/* ================= DEPOSIT ================= */

app.post("/api/deposit", auth, async (req, res) => {
  await Deposit.create({
    userId: req.userId,
    amount: req.body.amount
  });

  res.json({ message: "Deposit sent" });
});

/* ================= WITHDRAW ================= */

app.post("/api/withdraw", auth, async (req, res) => {
  const user = await User.findById(req.userId);

  if (user.balance < req.body.amount) {
    return res.status(400).json({ message: "Not enough balance" });
  }

  await Withdraw.create({
    userId: req.userId,
    amount: req.body.amount,
    wallet: req.body.wallet
  });

  res.json({ message: "Withdraw sent" });
});

/* ================= ADMIN ================= */

app.get("/api/admin/deposits", async (req, res) => {
  res.json(await Deposit.find());
});

app.post("/api/admin/approve", async (req, res) => {
  const d = await Deposit.findById(req.body.id);

  d.status = "approved";
  await d.save();

  await User.findByIdAndUpdate(d.userId, {
    $inc: { balance: d.amount }
  });

  res.json({ message: "approved" });
});

app.get("/api/admin/withdraws", async (req, res) => {
  res.json(await Withdraw.find());
});

app.post("/api/admin/withdraw/approve", async (req, res) => {
  const w = await Withdraw.findById(req.body.id);

  w.status = "approved";
  await w.save();

  await User.findByIdAndUpdate(w.userId, {
    $inc: { balance: -w.amount }
  });

  res.json({ message: "withdraw approved" });
});

/* ================= START ================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("PlayZone running on " + PORT);
});

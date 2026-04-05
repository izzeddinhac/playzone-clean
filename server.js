const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(__dirname));

// قاعدة بيانات مؤقتة
let users = [];

// تسجيل
app.post('/register', (req, res) => {
  const { username, password } = req.body;

  const user = {
    username,
    password,
    balance: 0
  };

  users.push(user);
  res.json({ message: 'تم التسجيل' });
});

// تسجيل دخول
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.json({ message: 'خطأ' });
  }

  res.json({ message: 'نجاح', balance: user.balance });
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(process.env.PORT || 10000

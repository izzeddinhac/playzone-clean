const express = require("express");
const path = require("path");

const app = express();

// قراءة JSON
app.use(express.json());

// عرض الملفات (HTML, CSS, JS)
app.use(express.static(__dirname));

// الصفحة الرئيسية
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// مثال API بسيط (تجربة)
app.get("/api/test", (req, res) => {
  res.json({ message: "Server is working ✅" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log("PlayZone running on port " + PORT);
}

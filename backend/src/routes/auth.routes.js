const express = require("express");
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ message: "Login route – implement in Day 2" });
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logout route – implement in Day 2" });
});

module.exports = router;
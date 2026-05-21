const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.get("/", verifyToken, requireAdmin, (req, res) => res.json({ message: "Get all sales" }));
router.get("/:id", verifyToken, requireAdmin, (req, res) => res.json({ message: "Get sale by ID" }));
router.post("/", verifyToken, (req, res) => res.json({ message: "Create sale/checkout" }));

module.exports = router;
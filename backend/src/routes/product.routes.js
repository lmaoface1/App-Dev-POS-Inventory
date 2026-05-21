const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.get("/", verifyToken, (req, res) => res.json({ message: "Get all products" }));
router.get("/:id", verifyToken, (req, res) => res.json({ message: "Get product by ID" }));
router.post("/", verifyToken, requireAdmin, (req, res) => res.json({ message: "Create product" }));
router.put("/:id", verifyToken, requireAdmin, (req, res) => res.json({ message: "Update product" }));
router.delete("/:id", verifyToken, requireAdmin, (req, res) => res.json({ message: "Delete product" }));

module.exports = router;
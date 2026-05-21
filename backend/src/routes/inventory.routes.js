const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.get("/", verifyToken, requireAdmin, (req, res) => res.json({ message: "Get inventory" }));
router.get("/low-stock", verifyToken, requireAdmin, (req, res) => res.json({ message: "Get low-stock items" }));
router.put("/:id", verifyToken, requireAdmin, (req, res) => res.json({ message: "Update stock" }));

module.exports = router;
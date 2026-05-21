const express = require("express");
const router = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/auth.middleware");

router.get("/summary", verifyToken, requireAdmin, (req, res) => res.json({ message: "Dashboard summary" }));
router.get("/sales", verifyToken, requireAdmin, (req, res) => res.json({ message: "Sales chart data" }));
router.get("/top-products", verifyToken, requireAdmin, (req, res) => res.json({ message: "Top products" }));

module.exports = router;
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../supabase.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password: hashed, role }])
    .select();

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: "User created", user: data[0] });
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !data) return res.status(401).json({ error: "User not found" });

  const match = await bcrypt.compare(password, data.password);
  if (!match) return res.status(401).json({ error: "Wrong password" });

  const token = jwt.sign(
    { id: data.id, role: data.role },
    process.env.JWT_SECRET,
    { expiresIn: "8h" },
  );

  res.json({ token, user: { id: data.id, name: data.name, role: data.role } });
});

// GET /api/auth/users — get all users (admin only)
router.get("/users", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at") // never expose password
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;

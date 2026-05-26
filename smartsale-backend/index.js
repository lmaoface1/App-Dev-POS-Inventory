import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import inventoryRoutes from "./routes/inventory.js";
import salesRoutes from "./routes/sales.js";
import dashboardRoutes from "./routes/dashboard.js";
import { verifyToken, adminOnly } from "./middleware/auth.js"; // ← add this

dotenv.config();
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Any logged-in user cashier or admin
app.use("/api/products", verifyToken, productRoutes);
app.use("/api/inventory", verifyToken, inventoryRoutes);
app.use("/api/sales", verifyToken, salesRoutes);

// Admin only
app.use("/api/dashboard", verifyToken, adminOnly, dashboardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

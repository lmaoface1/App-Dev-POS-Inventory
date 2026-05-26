import express from "express";
import supabase from "../supabase.js";

const router = express.Router();

// POST /api/sales — process checkout
router.post("/", async (req, res) => {
  const { cashier_id, items } = req.body;
  // items = [{ product_id, quantity, unit_price }, ...]

  const total_amount = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price,
    0,
  );

  const { data: sale, error: saleError } = await supabase
    .from("sales")
    .insert([{ cashier_id, total_amount }])
    .select()
    .single();

  if (saleError) return res.status(400).json({ error: saleError.message });

  const saleItems = items.map((item) => ({ ...item, sale_id: sale.id }));
  const { error: itemsError } = await supabase
    .from("sale_items")
    .insert(saleItems);

  if (itemsError) return res.status(400).json({ error: itemsError.message });

  for (const item of items) {
    const { data: product } = await supabase
      .from("products")
      .select("stock")
      .eq("id", item.product_id)
      .single();

    await supabase
      .from("products")
      .update({ stock: product.stock - item.quantity })
      .eq("id", item.product_id);
  }

  res.json({ message: "Sale completed", sale_id: sale.id, total_amount });
});

// GET /api/sales
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("sales")
    .select("*, users(name)")
    .order("created_at", { ascending: false });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// GET /api/sales/:id — get single sale with items
router.get("/:id", async (req, res) => {
  const { data: sale, error } = await supabase
    .from("sales")
    .select("*, users(name)")
    .eq("id", req.params.id)
    .single();

  if (error) return res.status(400).json({ error: error.message });

  const { data: items } = await supabase
    .from("sale_items")
    .select("*, products(name)")
    .eq("sale_id", req.params.id);

  // Map product name into each item
  const mappedItems = items.map((item) => ({
    ...item,
    product_name: item.products?.name,
  }));

  res.json({ ...sale, items: mappedItems });
});
export default router;

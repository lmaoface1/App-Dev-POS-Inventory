const { supabase } = require("../config/db");

// Table: products (id, name, category, price, stock, low_stock_threshold, created_at)

const getAllProducts = async () => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data;
};

const getProductById = async (id) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

const createProduct = async ({ name, category, price, stock, low_stock_threshold }) => {
  const { data, error } = await supabase
    .from("products")
    .insert([{ name, category, price, stock, low_stock_threshold }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const updateProduct = async (id, fields) => {
  const { data, error } = await supabase
    .from("products")
    .update(fields)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
};

const deleteProduct = async (id) => {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
};

const getLowStockProducts = async () => {
  // Returns products where stock <= low_stock_threshold
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .filter("stock", "lte", supabase.raw("low_stock_threshold"))
    .order("stock", { ascending: true });
  if (error) throw error;
  return data;
};

const deductStock = async (productId, quantity) => {
  // Uses Supabase RPC (define this function in Supabase SQL editor — see docs/SUPABASE_SETUP.md)
  const { data, error } = await supabase.rpc("deduct_stock", {
    p_product_id: productId,
    p_quantity: quantity,
  });
  if (error) throw error;
  return data;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  deductStock,
};
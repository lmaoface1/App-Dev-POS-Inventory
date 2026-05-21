const { supabase } = require("../config/db");

// Tables: sales (id, cashier_id, total_amount, created_at)
//         sale_items (id, sale_id, product_id, quantity, unit_price)

const getAllSales = async () => {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      id,
      total_amount,
      created_at,
      cashier:users(id, name, email)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};

const getSaleById = async (id) => {
  const { data, error } = await supabase
    .from("sales")
    .select(`
      id,
      total_amount,
      created_at,
      cashier:users(id, name, email),
      sale_items(
        id,
        quantity,
        unit_price,
        product:products(id, name, category)
      )
    `)
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

const createSale = async ({ cashier_id, total_amount }) => {
  const { data, error } = await supabase
    .from("sales")
    .insert([{ cashier_id, total_amount }])
    .select()
    .single();
  if (error) throw error;
  return data;
};

const createSaleItems = async (items) => {
  // items: [{ sale_id, product_id, quantity, unit_price }]
  const { data, error } = await supabase
    .from("sale_items")
    .insert(items)
    .select();
  if (error) throw error;
  return data;
};

// For dashboard: get sales grouped by day/week/month
const getSalesByPeriod = async (period = "daily") => {
  const truncMap = { daily: "day", weekly: "week", monthly: "month" };
  const trunc = truncMap[period] || "day";

  const { data, error } = await supabase.rpc("get_sales_by_period", {
    p_trunc: trunc,
  });
  if (error) throw error;
  return data;
};

module.exports = { getAllSales, getSaleById, createSale, createSaleItems, getSalesByPeriod };
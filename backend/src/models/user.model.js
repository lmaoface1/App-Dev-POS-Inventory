const { supabase } = require("../config/db");
 
// Table: users (id, name, email, password, role, created_at)
 
const findByEmail = async (email) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();
  if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
  return data;
};
 
const findById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};
 
const createUser = async ({ name, email, password, role }) => {
  const { data, error } = await supabase
    .from("users")
    .insert([{ name, email, password, role }])
    .select("id, name, email, role, created_at")
    .single();
  if (error) throw error;
  return data;
};
 
const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name, email, role, created_at")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
};
 
module.exports = { findByEmail, findById, createUser, getAllUsers };
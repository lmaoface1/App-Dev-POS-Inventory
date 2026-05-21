const { createClient } = require("@supabase/supabase-js");
 
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
 
if (!supabaseUrl || !supabaseKey) {
  console.error("https://mihafadqktjwadfrivhh.supabase.co");
  process.exit(1);
}
 
const supabase = createClient(supabaseUrl, supabaseKey);
 
const testConnection = async () => {
  try {
    // A lightweight query to verify connectivity
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) throw error;
    console.log("✓ Supabase connected successfully");
  } catch (error) {
    console.error("✗ Supabase connection failed:", error.message);
    process.exit(1);
  }
};
 
module.exports = { supabase, testConnection };
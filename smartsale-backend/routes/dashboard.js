import express from 'express'
import supabase from '../supabase.js'

const router = express.Router()

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  try {
    // All sales for total revenue + transaction count
    const { data: sales, error: salesErr } = await supabase
      .from('sales')
      .select('total_amount, created_at')

    if (salesErr) return res.status(400).json({ error: salesErr.message })

    // Today's sales only
    const todayStr = new Date().toISOString().split('T')[0]
    const todaySales = (sales || [])
      .filter(s => s.created_at && s.created_at.startsWith(todayStr))
      .reduce((sum, s) => sum + Number(s.total_amount || 0), 0)

    const totalRevenue = (sales || []).reduce(
      (sum, s) => sum + Number(s.total_amount || 0), 0
    )

    // Low stock items — compare stock against each product's own threshold
    const { data: allProducts, error: lowErr } = await supabase
      .from('products')
      .select('id, stock, low_stock_threshold')

    if (lowErr) return res.status(400).json({ error: lowErr.message })

    const lowStock = (allProducts || []).filter(
      p => p.stock <= (p.low_stock_threshold ?? 5)
    )

    // Inventory value (price * stock) — reuse allProducts already fetched above
    const { data: products, error: prodErr } = await supabase
      .from('products')
      .select('price, stock')

    if (prodErr) return res.status(400).json({ error: prodErr.message })

    const inventoryValue = (products || []).reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.stock || 0), 0
    )

    res.json({
      total_transactions: (sales || []).length,
      total_revenue: totalRevenue,
      today_sales: todaySales,
      low_stock_count: lowStock.length,
      inventory_value: inventoryValue,
      pending_orders: 0, // no orders table yet — placeholder
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/dashboard/sales-by-day
// Returns [{ day: 1, total: 1200 }, ...] grouped by day-of-month
router.get('/sales-by-day', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sales')
      .select('created_at, total_amount')
      .order('created_at', { ascending: true })

    if (error) return res.status(400).json({ error: error.message })

    // Group by day label (e.g. "May 27")
    const grouped = {}
    for (const row of (data || [])) {
      const date = new Date(row.created_at)
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      grouped[label] = (grouped[label] || 0) + Number(row.total_amount || 0)
    }

    const result = Object.entries(grouped).map(([day, total]) => ({ day, total }))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/dashboard/top-products
// Returns top 5 products by quantity sold
router.get('/top-products', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sale_items')
      .select('product_id, quantity, unit_price, products(name)')

    if (error) return res.status(400).json({ error: error.message })

    // Aggregate by product
    const map = {}
    for (const item of (data || [])) {
      const id = item.product_id
      if (!map[id]) {
        map[id] = {
          product_id: id,
          name: item.products?.name || `Product ${id}`,
          total_quantity: 0,
          total_revenue: 0,
        }
      }
      map[id].total_quantity += Number(item.quantity || 0)
      map[id].total_revenue += Number(item.quantity || 0) * Number(item.unit_price || 0)
    }

    const result = Object.values(map)
      .sort((a, b) => b.total_quantity - a.total_quantity)
      .slice(0, 5)

    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
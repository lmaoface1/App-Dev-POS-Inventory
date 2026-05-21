import express from 'express'
import supabase from '../supabase.js'

const router = express.Router()

// GET /api/dashboard/summary
router.get('/summary', async (req, res) => {
  const { data: sales } = await supabase.from('sales').select('total_amount')
  const { data: lowStock } = await supabase
    .from('products')
    .select('id')
    .filter('stock', 'lte', 5)

  const totalRevenue = sales.reduce((sum, s) => sum + s.total_amount, 0)

  res.json({
    total_transactions: sales.length,
    total_revenue: totalRevenue,
    low_stock_count: lowStock.length
  })
})

// GET /api/dashboard/sales-by-day
router.get('/sales-by-day', async (req, res) => {
  const { data, error } = await supabase
    .from('sales')
    .select('created_at, total_amount')
    .order('created_at', { ascending: true })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

export default router
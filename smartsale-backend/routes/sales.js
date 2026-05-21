import express from 'express'
import supabase from '../supabase.js'

const router = express.Router()

// POST /api/sales — process checkout
router.post('/', async (req, res) => {
  const { cashier_id, items } = req.body
  // items = [{ product_id, quantity, unit_price }, ...]

  const total_amount = items.reduce(
    (sum, item) => sum + item.quantity * item.unit_price, 0
  )

  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert([{ cashier_id, total_amount }])
    .select()
    .single()

  if (saleError) return res.status(400).json({ error: saleError.message })

  const saleItems = items.map(item => ({ ...item, sale_id: sale.id }))
  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(saleItems)

  if (itemsError) return res.status(400).json({ error: itemsError.message })

  for (const item of items) {
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single()

    await supabase
      .from('products')
      .update({ stock: product.stock - item.quantity })
      .eq('id', item.product_id)
  }

  res.json({ message: 'Sale completed', sale_id: sale.id, total_amount })
})

// GET /api/sales
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('sales')
    .select('*, users(name)')
    .order('created_at', { ascending: false })

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

export default router
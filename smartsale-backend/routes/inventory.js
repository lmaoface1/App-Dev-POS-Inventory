import express from 'express'
import supabase from '../supabase.js'

const router = express.Router()

// GET /api/inventory
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*')
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// GET /api/inventory/low-stock — uses each product's own low_stock_threshold
router.get('/low-stock', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) return res.status(400).json({ error: error.message })

  // Filter in JS so we compare against each product's own threshold
  const lowStock = (data || []).filter(p => p.stock <= (p.low_stock_threshold ?? 5))
  res.json(lowStock)
})

// PUT /api/inventory/:id
router.put('/:id', async (req, res) => {
  const { quantity } = req.body
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('stock')
    .eq('id', req.params.id)
    .single()

  if (fetchError || !product) return res.status(400).json({ error: 'Product not found' })

  const newStock = product.stock + parseInt(quantity, 10)
  const { data, error } = await supabase
    .from('products')
    .update({ stock: newStock })
    .eq('id', req.params.id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
})

export default router
import express from 'express'
import supabase from '../supabase.js'

const router = express.Router()

// GET /api/products
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*')
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// GET /api/products/low-stock — uses each product's own low_stock_threshold
router.get('/low-stock', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')

  if (error) return res.status(400).json({ error: error.message })

  const lowStock = (data || []).filter(p => p.stock <= (p.low_stock_threshold ?? 5))
  res.json(lowStock)
})

// POST /api/products
router.post('/', async (req, res) => {
  const { name, category, price, stock, low_stock_threshold } = req.body
  const { data, error } = await supabase
    .from('products')
    .insert([{ name, category, price, stock, low_stock_threshold }])
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
})

// PUT /api/products/:id
router.put('/:id', async (req, res) => {
  const { name, category, price, stock, low_stock_threshold } = req.body
  const { data, error } = await supabase
    .from('products')
    .update({ name, category, price, stock, low_stock_threshold })
    .eq('id', req.params.id)
    .select()

  if (error) return res.status(400).json({ error: error.message })
  res.json(data[0])
})

// DELETE /api/products/:id
router.delete('/:id', async (req, res) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', req.params.id)

  if (error) return res.status(400).json({ error: error.message })
  res.json({ message: 'Product deleted' })
})

export default router
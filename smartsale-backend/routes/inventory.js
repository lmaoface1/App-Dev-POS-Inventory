import express from 'express'
import supabase from '../supabase.js'

const router = express.Router()

// GET /api/inventory
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*')
  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
})

// GET /api/inventory/low-stock
router.get('/low-stock', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .lte('stock', 5)

  if (error) return res.status(400).json({ error: error.message })
  res.json(data)
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

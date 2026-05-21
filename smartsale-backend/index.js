import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import salesRoutes from './routes/sales.js'
import dashboardRoutes from './routes/dashboard.js'

dotenv.config()
const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/sales', salesRoutes)
app.use('/api/dashboard', dashboardRoutes)

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
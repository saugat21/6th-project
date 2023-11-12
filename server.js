import express from 'express'
import colors from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoute from './routes/authRoute.js'
import categoryRoute from './routes/categoryRoute.js'
import productRoute from './routes/productRoute.js'
import analyticsRoute from './routes/analyticsRoute.js'
import orderRoute from './routes/orderRoute.js'

//env configuration
dotenv.config()

//Database connection
connectDB()

//rest object
const app = express()

//middleware
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//routes
// app.use('api/v1/auth', authRoute);
app.use(authRoute)
app.use(categoryRoute)
app.use(productRoute)
app.use(analyticsRoute)
app.use(orderRoute)

//rest api
app.get('/', (req, res) => {
  res.send('<h1>This is Food ordering app</h1>')
})

//port
const PORT = process.env.PORT || 8080

//run listen
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`.bgCyan.white)
})

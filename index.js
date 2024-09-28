require('dotenv').config()
const express = require('express')
const { connectDB } = require('./src/config/db')
const cors = require('cors')
const usersRouter = require('./src/api/routes/user')
const eventsRouter = require('./src/api/routes/event')
const cloudinary = require('cloudinary').v2

const app = express()
app.use(express.json())
connectDB()
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use(cors())
app.use('/api/v1/users', usersRouter)
app.use('/api/v1/events', eventsRouter)

app.use('*', (req, res, next) => {
  return res.status(404).json('route not found')
})

app.listen(3000, () => {
  console.log('Server deployed at http://localhost:3000')
})

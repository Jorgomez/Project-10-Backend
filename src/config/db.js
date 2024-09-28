const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL)
    console.log('conected')
  } catch (error) {
    return res.status(404).json('Error connecting to the BBDD')
  }
}

module.exports = { connectDB }

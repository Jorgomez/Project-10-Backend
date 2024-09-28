const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const USERS = require('../../data/users')
const User = require('../../api/models/user')

const bombUsers = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgomez:root@cluster0.ie01jpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )

    await User.collection.drop()
    console.log('Users deleted')

    const users = await Promise.all(
      USERS.map(async (userData) => {
        const hashedPassword = await bcrypt.hash(userData.password, 10)
        return { ...userData, password: hashedPassword }
      })
    )

    await User.insertMany(users)
    console.log('Users introduced')

    await mongoose.disconnect()
    console.log('server desconected')
  } catch (error) {
    console.log('error connecting')
  }
}

bombUsers()

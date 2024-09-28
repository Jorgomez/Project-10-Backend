const mongoose = require('mongoose')
const Event = require('../../api/models/event')
const eventsData = require('../../data/events')

const bombEvents = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://jorgomez:root@cluster0.ie01jpp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    )
    await Event.collection.drop()
    console.log('Events deleted')

    await Event.insertMany(eventsData)
    console.log('Users introduced')

    await mongoose.disconnect()
    console.log('server desconected')
  } catch (error) {
    console.log('error connecting'), console.log(error)
  }
}

bombEvents()

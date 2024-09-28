const mongoose = require('mongoose')
const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false,
      trim: true
    },
    poster: {
      type: String,
      required: false
    },
    assistants: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'users'
      }
    ],
    creator: {
      type: mongoose.Types.ObjectId,
      ref: 'users'
    }
  },
  {
    timestamps: true,
    collection: 'events'
  }
)

const Event = mongoose.model('events', eventSchema, 'events')

module.exports = Event

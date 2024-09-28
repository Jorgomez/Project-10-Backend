const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      default: 'user',
      enum: ['admin', 'user']
    },
    profileImg: {
      type: String,
      required: true,
      default:
        'https://res.cloudinary.com/digcf0lad/image/upload/v1711571023/man_azkjut.png'
    },
    events: [{ type: mongoose.Types.ObjectId, ref: 'events', required: false }]
  },
  {
    timestamps: true,
    collection: 'users'
  }
)

userSchema.pre('save', function () {
  this.password = bcrypt.hashSync(this.password, 10)
})

const User = mongoose.model('users', userSchema, 'users')

module.exports = User

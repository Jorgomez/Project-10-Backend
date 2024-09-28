const bcrypt = require('bcrypt')
const User = require('../models/user')
const { generateSign } = require('../../config/jwt')
const { deleteFile } = require('../../utils/delete.file')

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate('events')

    return res.status(200).json(users)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error fetching users', details: error.message })
  }
}

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params
    userFound = await User.findById(id).populate('events')

    // -------
    if (!userFound) {
      return res.status(404).json({ error: 'User not found' })
    }

    //
    return res.status(200).json(userFound)
  } catch (error) {
    return res
      .status(404)
      .json({ error: 'Error fetching user by ID', details: error.message })
  }
}

const register = async (req, res, next) => {
  try {
    const { userName, events } = req.body

    const newUser = new User({
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      profileImg: req.body.profileImg,
      events: []
    })
    if (req.files) {
      newUser.profileImg = req.files.profileImg[0].path
    }
    const userDuplicated = await User.findOne({ userName })
    if (userDuplicated) {
      return res
        .status(400)
        .json({ error: `The username "${userName}" already exists.` })
    }
    if (events) {
      const filterdEvents = Array.from(
        new Set(events.map((eventId) => eventId.toString()))
      )
      newUser.events = filterdEvents
    }

    const userSaved = await newUser.save()

    return res.status(201).json(userSaved)
  } catch (error) {
    // return res.status(400).json('Error Register Function'), console.log(error) respuesta anterior
    return res
      .status(400)
      .json({ error: 'Error in register function', details: error.message })
  }
}

const login = async (req, res, next) => {
  try {
    const { userName, password } = req.body
    const user = await User.findOne({ userName })
    if (!user) {
      // return res.status(400).json('Password/User error') respuesta anterior
      return res.status(400).json({ error: 'Incorrect username or password' })
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateSign(user._id)
      return res.status(200).json({
        user,
        token
      })
    } else {
      // return res.status(400).json('Password/User error') respuesta anterior
      return res.status(400).json({ error: 'Incorrect username or password' })
    }
  } catch (error) {
    // return res.status(400).json('error login Function'), console.log(error)respuesta anterior
    return res
      .status(400)
      .json({ error: 'Error in login function', details: error.message })
  }
}

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const currentValuesUser = await User.findById(id)
    if (!currentValuesUser) {
      // return res.status(404).json('User not found') rspeuesta anterior
      return res.status(404).json({ error: 'User not found' })
    }
    const updateReq = req.body
    const { events: newEvents = [], profileImg } = req.body
    const filterdNewEvents = Array.from(
      new Set(newEvents.map((eventId) => eventId.toString()))
    )
    const allEvents = [
      ...currentValuesUser.events.map((event) => event.toString()),
      ...filterdNewEvents
    ]
    if (req.files && req.files.profileImg && req.files.profileImg.length > 0) {
      deleteFile(currentValuesUser.profileImg)
      if (currentValuesUser.profileImg) {
        deleteFile(currentValuesUser.profileImg)
      }
      updateReq.profileImg = req.files.profileImg[0].path
    }
    const filterdEvents = Array.from(new Set(allEvents))

    updateReq.events = filterdEvents

    const updatedUser = await User.findByIdAndUpdate(id, updateReq, {
      new: true
    })

    return res.status(200).json({
      message: 'User successfully updated',
      user: updatedUser
    })
  } catch (error) {
    // return res.status(404).json({ error: 'User not found' })
    return res
      .status(400)
      .json({ error: 'Error Updatting Profile', details: error.message })
  }
}
const removeEventFromUser = async (req, res) => {
  try {
    const userId = req.params.id
    const { events } = req.body

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { events } },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(404).json('User not found')
    }

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error removing event from user')
  }
}

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params
    const userDeleted = await User.findByIdAndDelete(id)
    deleteFile(userDeleted.profileImg)
    return res
      .status(200)
      .json({ mensaje: 'Deleted User', userdeleted: userDeleted })
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error Deleting Profile', details: error.message })
  }
}
module.exports = {
  login,
  register,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  removeEventFromUser
}

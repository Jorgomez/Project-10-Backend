const Event = require('../api/models/event')
const User = require('../api/models/user')
const { verifyJwt } = require('../config/jwt')

const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      // return res.status(400).json('you are not authorized') respuesta anterior
      return res.status(400).json({ error: `you are not authorized` })
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)
    const user = await User.findById(id)
    user.password = null
    req.user = user
    next()
  } catch (error) {
    // return res.status(400).json({ error: `you are not authorized` })
    return res
      .status(400)
      .json({ error: `you are not authorized`, details: error.message })
  }
}

const isUserOrAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { id: idToUpdate } = req.params
    const { role } = req.body

    if (!token) {
      return res.status(400).json({ error: `you are not admin` })
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id: tokenId } = verifyJwt(parsedToken)

    const user = await User.findById(tokenId)

    if (role && user.role !== 'admin') {
      return res.status(403).json({
        error: 'you are not admin',
        message: 'Only admins can update roles'
      })
    }
    if (user.id === idToUpdate || user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res.status(400).json({
        message: 'you are not authorized to do this'
      })
    }
  } catch (error) {
    return (
      res.status(400).json({
        message: 'you are not authorized'
      }),
      console.log(error)
    )
  }
}

const isCreator = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { id } = req.params
    const event = await Event.findById(id)
    if (!token) {
      return res.status(400).json('nyou are not authorized')
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id: tokenId } = verifyJwt(parsedToken)
    const user = await User.findById(tokenId)

    if (user.id === event.creator.toString()) {
      user.password = null
      req.user = user
      next()
    } else {
      return res
        .status(400)
        .json('You can not Update an Event from another user')
    }
  } catch (error) {
    return res.status(400).json('no estas'), console.log(error)
  }
}

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    if (!token) {
      return res.status(400).json('you are not authorized')
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id } = verifyJwt(parsedToken)

    const user = await User.findById(id)
    if (user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res.status(400).json('You role is not Admin')
    }
  } catch (error) {
    return res.status(400).json('you are not authorized')
  }
}

const isCreatorOrAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization
    const { id } = req.params
    const event = await Event.findById(id)
    if (!token) {
      return res.status(400).json('you are not authorized')
    }
    const parsedToken = token.replace('Bearer ', '')
    const { id: tokenId } = verifyJwt(parsedToken)
    const user = await User.findById(tokenId)
    console.log(
      'storage user:',
      user.id,
      'eventcreator:',
      event.creator.toString()
    )
    if (user.id === event.creator.toString() || user.role === 'admin') {
      user.password = null
      req.user = user
      next()
    } else {
      return res
        .status(400)
        .json(
          'You can not Update an Event from another user if you are not the Admin'
        )
    }
  } catch (error) {
    return res.status(400).json('you are not authorized'), console.log(error)
  }
}
module.exports = {
  isAuth,
  isUserOrAdmin,
  isCreator,
  isAdmin,
  isCreatorOrAdmin
}

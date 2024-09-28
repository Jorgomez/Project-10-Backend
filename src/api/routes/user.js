const { isAuth, isUserOrAdmin } = require('../../middlewares/auth')
const { upload } = require('../../middlewares/file')
const express = require('express')
const multer = require('multer')
const {
  getUsers,
  getUserById,
  register,
  login,
  updateUser,
  deleteUser,
  removeEventFromUser
} = require('../controllers/user')

const usersRouter = require('express').Router()
usersRouter.get('/', getUsers)
usersRouter.get('/:id', isAuth, getUserById)
usersRouter.post(
  '/register',
  upload('project10/profileUsers').fields([{ name: 'profileImg' }]),
  register
)
usersRouter.post('/login', login)

usersRouter.put(
  '/:id',
  upload('project10/profileUsers').fields([{ name: 'profileImg' }]),
  isUserOrAdmin,
  updateUser
)

usersRouter.put('/removeEvent/:id', isUserOrAdmin, removeEventFromUser)
usersRouter.delete(
  '/:id',
  isUserOrAdmin,
  upload('project10/profileUsers').fields([{ name: 'profileImg' }]),
  deleteUser
)

module.exports = usersRouter

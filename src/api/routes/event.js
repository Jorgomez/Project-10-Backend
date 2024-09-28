const {
  isAuth,
  isCreator,
  isAdmin,
  isCreatorOrAdmin
} = require('../../middlewares/auth')
const { upload } = require('../../middlewares/file')
const {
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  createEvent,
  removeUserFromEvent
} = require('../controllers/event')

const eventsRouter = require('express').Router()

eventsRouter.get('/', getEvents)
eventsRouter.get('/:id', isAuth, getEventById)
eventsRouter.post(
  '/',
  isAuth,
  upload('project10/posters').fields([{ name: 'poster' }]),
  createEvent
)
eventsRouter.put(
  '/:id',
  isAuth,
  upload('project10/posters').fields([{ name: 'poster' }]),
  updateEvent
)
eventsRouter.put('/removeAssistance/:id', isAuth, removeUserFromEvent)
eventsRouter.delete(
  '/:id',
  isCreatorOrAdmin,
  upload('project10/posters').fields([{ name: 'poster' }]),
  deleteEvent
)

module.exports = eventsRouter

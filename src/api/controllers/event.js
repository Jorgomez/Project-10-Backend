const { deleteFile } = require('../../utils/delete.file')
const Event = require('../models/event')

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate('assistants')
    return res.status(200).json(events)
  } catch (error) {
    return res.status(400).json('error getEvents Function')
  }
}

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params
    eventFound = await Event.findById(id)
      .populate('assistants')
      .populate('creator')
    return res.status(200).json(eventFound)
  } catch (error) {
    return res.status(404).json('error in the getEventById function')
  }
}

const createEvent = async (req, res, next) => {
  try {
    const { title, assistants } = req.body

    const newEvent = new Event({ ...req.body, creator: req.user._id })
    if (req.files) {
      newEvent.poster = req.files.poster[0].path
    }
    const eventDuplicated = await Event.findOne({ title })
    if (eventDuplicated) {
      return res
        .status(400)
        .json({ error: `The event named" ${title}" already exists.` })
    }
    if (assistants) {
      const filterdAssistans = Array.from(
        new Set(assistants.map((userId) => userId.toString()))
      )
      newEvent.assistants = filterdAssistans
    }

    const eventSaved = await newEvent.save()

    return res.status(201).json(eventSaved)
  } catch (error) {
    return res
      .status(400)
      .json({ error: 'Error in Creating Event', details: error.message })
  }
}

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const currentValuesEvent = await Event.findById(id)
    if (!currentValuesEvent) {
      return res.status(404).json('Event not found')
    }
    const updateReq = req.body
    if (req.files) {
      deleteFile(currentValuesEvent.poster)
      updateReq.poster = req.files.poster[0].path
    }
    const { assistants: newAssistants = [] } = req.body
    const filterdNewAssistants = Array.from(
      new Set(newAssistants.map((userId) => userId.toString()))
    )
    const allAssistants = [
      ...currentValuesEvent.assistants.map((event) => event.toString()),
      ...filterdNewAssistants
    ]

    const filterdAssistants = Array.from(new Set(allAssistants))

    updateReq.assistants = filterdAssistants

    const updatedEvent = await Event.findByIdAndUpdate(id, updateReq, {
      new: true
    })

    return res.status(200).json(updatedEvent)
  } catch (error) {
    return res.status(400).json('error to update'), console.log(error)
  }
}

const removeUserFromEvent = async (req, res) => {
  try {
    const eventId = req.params.id
    const { assistants } = req.body

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { $pull: { assistants } },
      { new: true }
    )

    if (!updatedEvent) {
      return res.status(404).json('Event not found')
    }

    return res.status(200).json(updatedEvent)
  } catch (error) {
    console.log(error)
    return res.status(400).json('Error removing user from event')
  }
}

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params
    const eventDeleted = await Event.findByIdAndDelete(id)
    deleteFile(eventDeleted.poster)
    return res
      .status(200)
      .json({ mensaje: 'Deleted Event', eventdeleted: eventDeleted })
  } catch (error) {
    return res.status(400).json('error delete Function')
  }
}
module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  removeUserFromEvent
}

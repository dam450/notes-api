const { Router } = require('express')
const NotesController = require('../controllers/NotesController')


const notesRoutes = Router()

const notesController = new NotesController()

notesRoutes.post('/:user_id', notesController.create)
notesRoutes.get('/:note_id', notesController.show)

module.exports = notesRoutes

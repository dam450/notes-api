const { Router } = require("express")

const statusRouter = require("./status.routes")
const usersRouter = require("./user.routes")
const notesRoutes = require("./notes.routes")
const tagsRoutes = require('./tags.routes')
const sessionsRoutes = require("./sessions.routes")

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/status', statusRouter)
routes.use('/notes', notesRoutes)
routes.use('/tags', tagsRoutes)
routes.use('/sessions', sessionsRoutes)

module.exports = routes

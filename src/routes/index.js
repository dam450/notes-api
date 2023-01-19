const { Router } = require("express")

const statusRouter = require("./status.routes")
const usersRouter = require("./user.routes")
const notesRoutes = require("./notes.routes")

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/status', statusRouter)
routes.use('/notes', notesRoutes)

module.exports = routes

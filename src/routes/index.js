const { Router } = require("express")

const statusRouter = require("./status.routes")
const usersRouter = require("./user.routes")
const notesRoutes = require("./notes.routes")
const tagsRoutes = require('./tags.routes')
const sessionsRoutes = require("./sessions.routes")

const routes = Router()

// routes.options('/', (req, res) => {
//   res.setHeader('Access-Control-Allow-Origin', '*')
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, DELETE, OPTIONS')
//   return res.status(204).end()
// })

routes.use('/users', usersRouter)
routes.use('/', statusRouter)
routes.use('/notes', notesRoutes)
routes.use('/tags', tagsRoutes)
routes.use('/sessions', sessionsRoutes)

module.exports = routes

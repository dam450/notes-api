const { Router } = require("express")

const statusRouter = require("./status.routes")
const usersRouter = require("./user.routes")

const routes = Router()

routes.use('/users', usersRouter)
routes.use('/status', statusRouter)

module.exports = routes
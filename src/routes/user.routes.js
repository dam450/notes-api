const { Router } = require('express')
const UsersController = require('../controllers/UsersController')

const usersRoutes = Router()

function myMiddleware(request, response, next) {
  console.log('Passou pelo middleware', request.body)
  next()
}

const userController = new UsersController()

usersRoutes.post("/", myMiddleware, userController.create)

module.exports = usersRoutes
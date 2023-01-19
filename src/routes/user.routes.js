const { Router } = require('express')
const UsersController = require('../controllers/UsersController')

const usersRoutes = Router()

function myMiddleware(request, response, next) {
  console.log('Passou pelo middleware', request.body)
  console.count('[middleware] ')
  next()
}

const userController = new UsersController()

usersRoutes.post("/", myMiddleware, userController.create)
usersRoutes.put("/:id", myMiddleware, userController.update)

module.exports = usersRoutes
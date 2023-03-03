const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { compare } = require('bcryptjs')
const authConfig = require('../configs/auth')
const { sign } = require('jsonwebtoken')

class SessionsController {

  async create(request, response) {
    const { email, password } = request.body

    // const user = await knex('users').where({ email }).first()
    const user = await knex('users').where( knex.raw('LOWER(email) = LOWER(?)', email)).first()

    if (!user) {
      throw new AppError('Email e/ou senha inválidos', 401)
    }

    const passwordMatches = await compare(password, user.password)
    if (!passwordMatches) {
      throw new AppError('Email e/ou senha inválidos', 401)
    }

    const { expiresIn, secret } = authConfig.jwt
    const token = sign({}, secret, { subject: String(user.id), expiresIn })

    const userInfo = {
      id: user.id,
      avatar: user.avatar,
      name: user.name,
      email: user.email
    }

    return response.status(201).json({ token, user: userInfo })
  }

}

module.exports = SessionsController

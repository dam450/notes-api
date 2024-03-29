const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const { validEmail } = require('../utils/emailCheck')

const sqliteConnection = require('../database/sqlite')
const UserRepository = require('../repositories/UserRepository')
const UserCreateService = require('../services/UserCreateService')

class UsersController {
  async create(request, response) {
    const { name, email, password } = request.body

    const userRepository = new UserRepository()
    const userCreateService = new UserCreateService(userRepository)
    await userCreateService.execute({ name, email, password })

    return response.status(201).json({ name, email, password: '***' })
  }

  async update(request, response) {
    //const { id } = request.params
    const user_id = request.user.id
    const { name, email, password, new_password } = request.body

    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id = (?)', [
      user_id,
    ])

    if (!user) throw new AppError('Usuário não encontrado!')

    if (email && !validEmail(email)) {
      throw new AppError('E-mail inválido.')
    }

    // console.log("email: ", email?.toUpperCase())
    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE lower(email) = (?)',
      [email?.toLowerCase()]
    )

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este email já está em uso.')
    }

    user.name = name ?? user.name
    user.email = email ?? user.email

    if (new_password && !password) {
      throw new AppError(
        'Informe a senha atual para definir uma nova senha.',
        401
      )
    }

    if (new_password && password) {
      const checkPassword = await compare(password, user.password)

      if (!checkPassword) {
        throw new AppError('Senha não confere.', 401)
      }

      user.password = await hash(new_password, 8)
    }

    await database.run(
      `UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = datetime('now')
      WHERE id = ? `,
      [user.name, user.email, user.password, user_id]
    )

    return response.status(200).json()
  }
}

module.exports = UsersController

//@ts-check
const { hash } = require('bcryptjs')
const AppError = require('../utils/AppError')
const { validEmail } = require('../utils/emailCheck')

class UserCreateService {

  constructor(userRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }) {
    if (!name || !email || !password) {
      throw new AppError('Valor obrigatório ausente.')
    }

    if (!validEmail(email)) {
      throw new AppError('E-mail inválido.')
    }

    const userExists = await this.userRepository.findByEmail(email)

    if (userExists) {
      throw new AppError('Este e-mail já está em uso.', 406)
    }

    const hashedPassword = await hash(password, 8)

    const userCreated = await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })
    return userCreated
  }
}

module.exports = UserCreateService

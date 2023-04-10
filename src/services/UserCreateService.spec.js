const UserCreateService = require('./UserCreateService')
const UserRepositoryInMemory = require('../repositories/UserRepositoryInMemory')
const AppError = require('../utils/AppError')

describe('UserCreateService', () => {

  test('user should be created', async () => {
    const user = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456',
    }
    const userRepository = new UserRepositoryInMemory()
    const userCreateService = new UserCreateService(userRepository)
    const userCreated = await userCreateService.execute(user)

    expect(userCreated).toHaveProperty('id')
  })

  test('user should not be created if email already exists', async () => {
    const user = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456',
    }
    const userRepository = new UserRepositoryInMemory()
    const userCreateService = new UserCreateService(userRepository)

    await userCreateService.execute(user)

    await expect(userCreateService.execute(user)).rejects.toEqual(
      new AppError('Este e-mail já está em uso.', 406)
    )

    // expect(async () => userCreateService.execute(user)).toThrow(AppError)

  })
})

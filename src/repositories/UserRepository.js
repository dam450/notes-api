//@ts-check
const sqliteConnection = require('../database/sqlite')

class UserRepository {
  /**
   * @typedef {Object} User
   * @property {Number} id - user id
   * @property {String} email - user email
   */

  /**
   * Find a user by email
   * @param {String} email user email
   * @returns {Promise.<User>} user
   */
  async findByEmail(email) {
    const database = await sqliteConnection()
    const user = await database.get(
      'SELECT id, email FROM users WHERE LOWER(email) = LOWER(?)',
      [email]
    )
    return user
  }

  /**
   * @typedef {Object} NewUser
   * @property {String} name - user name
   * @property {String} email - e-mail address of the user
   * @property {String} password - user password
   */

  /**
   * @typedef {Object} UserID
   * @property {Number | undefined} id - user id
   */

  /**
   * Creates a new user
   * @param {NewUser} user { name, email, password }
   * @returns {Promise.<UserID>} { id }
   */
  async create({ name, email, password }) {
    const database = await sqliteConnection()
    const { lastID } = await database.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, password]
    )
    return { id: lastID }
  }
}

module.exports = UserRepository

const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')

class UsersController {

  async create(request, response) {

    const { name, email, password } = request.body
    
    if (!name) {
      throw new AppError("Nome é obrigatório!")
    }

    const database = await sqliteConnection()
    
    const checkUserExists = await database.get("SELECT email FROM users WHERE email = (?)", [email])
    console.log("User exists:", checkUserExists)

      
      if (checkUserExists) { 
        throw new AppError("Este e-mail já está em uso.", 406)
      }

    const hashedPassword = await hash(password, 8)
      
    await database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [ name, email, hashedPassword ]
    )

    response.status(201).json({ name, email, password: "***" })


  }
}

module.exports = UsersController
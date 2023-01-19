const knex = require('../database/knex')

class NotesController {

  async create(request, response) {
    const req = request.body
    response.json({req})
  }

}

module.exports = NotesController

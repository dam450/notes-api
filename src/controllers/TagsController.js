const knex = require('../database/knex')

class TagsController {

  async index(request, response) {


    response.json({ ...request.body, ...request.query })

  }
}

module.exports = TagsController

const knex = require('../database/knex')

class TagsController {

  async index(request, response) {

    const { user_id } = request.body

    const tags = await knex('tags').select('*').where({ user_id })

    return response.json(tags)

  }
}

module.exports = TagsController

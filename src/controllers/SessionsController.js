class SessionsController {

  async create(request, response) {
    const {email, password} = request.body

    return response.status(201).json({ email, password })
  }

}

module.exports = SessionsController

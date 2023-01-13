const { Router } = require('express')

const statusRouter = Router()

statusRouter.get('/', (req, res) => {
  console.time('status', 'server')
  res.send('Server is Online! 🚀')
  console.timeEnd('status', 'server')
})

module.exports = statusRouter
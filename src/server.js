const express = require('express')
const cors = require('cors')
const migrationsRun = require('./database/sqlite/migrations')
const { debug } = require('./utils/debug')

require('express-async-errors')

const routes = require('./routes')

const AppError = require('./utils/AppError')
const uploadConfig = require('./configs/upload')

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
}


const app = express()
app.use(cors(corsOptions))
app.use(express.json())
app.use(debug.middleware)

app.use('/files', express.static(uploadConfig.UPLOAD_FOLDER))

app.use(routes)

migrationsRun()

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
    })
  }

  console.log('erro: ', error)

  return response.status(500).json({
    status: 'error',
    message: 'internal server error',
  })
})

const PORT = 3333

app.listen(PORT, () => {
  console.log(`[Server] listening on port: ${PORT}`)

  globalThis.onlineSince = new Date()
})

debug.log(`Server ready at: ${new Date().toLocaleString()}`)

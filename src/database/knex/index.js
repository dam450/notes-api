const config = require('../../../knexfile')
const knex = require('knex')

const connection = knex(config.development)

// connection.on('query', queryData => {
//   console.log('[ Knex ] ', queryData.sql, queryData.bindings)
// })

module.exports = connection

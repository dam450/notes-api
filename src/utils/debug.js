const log = require('debug')('api:debug');

const debug = {}

debug.log = log

debug.middleware = (req, res, next) => {
  const { params, body, query, url, method, user } = req
  log(`=========${new Date().toLocaleString()}=========`)
  log('Method:', method)
  log('   URL:', url)
  log(' Query:', query)
  log('  Body:', body)
  log('Params:', params)
  next()
}

module.exports = { debug }

const sqlite3 = require('sqlite3')
const sqlite = require('sqlite')
const path = require('path')

/**
 * Faz a conexão com o banco de dados SQLite.
 * @returns database
 */
async function sqliteConnection() {
  const database = await sqlite.open({
    filename: path.resolve(__dirname, '..', 'database.db'),
    driver: sqlite3.Database
  })
  return database
}

module.exports = sqliteConnection

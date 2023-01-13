class AppError {
  message
  statusCode
/**
 * 
 * @param {String} message Error message text
 * @param {Number} statusCode HTTTP Status code number of error
 */
  constructor(message, statusCode = 400) {
    this.message = message
    this.statusCode = statusCode
  }
}

module.exports = AppError
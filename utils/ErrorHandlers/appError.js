/**
 * Handle api error and message passing
 */
class AppError extends Error {
  /**
   * Adds two numbers together.
   * @param {String} message The message write/pass message for as error.
   * @param {String} statusCode The status code for to easy
   * understand for frontend developer.
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

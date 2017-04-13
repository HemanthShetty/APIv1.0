/**
 * @fileoverview Custom error object that represents error caused by incorrect client request
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 12/23/16
 */


/**
 * Custom Error object creation
 * @function
 * @param {string} message Represents the message detailing the error
 */
function BadRequestError(message) {
    this.errorCode = 100010;
    this.message = message || 'Bad Request';
    this.statusCode = 400;
}

BadRequestError.prototype = Object.create(Error.prototype);

BadRequestError.prototype.constructor = BadRequestError;

module.exports = BadRequestError;
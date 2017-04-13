/**
 * @fileoverview Custom error object that represents the error caused when a requested resource was not found
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 12/23/16
 */


/**
 * Custom Error object creation
 * @function
 * @param {string} message Represents the message detailing the error which occured
 */
function NotFoundError(message) {
    this.errorCode = 10002;
    this.message = message || 'Resource Not Found';
    this.statusCode = 404;
}

NotFoundError.prototype = Object.create(Error.prototype);

NotFoundError.prototype.constructor = NotFoundError;

module.exports = NotFoundError;

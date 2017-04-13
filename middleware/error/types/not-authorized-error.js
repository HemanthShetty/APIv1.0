/**
 * @fileoverview Custom error object that represents the error caused due to client not being authorized
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 12/23/16
 */


/**
 * Custom Error object creation
 * @function
 * @param {string} message Represents the message detailing the error which occured
 */
function NotAuthorizedError(message) {
    this.errorCode = 10001;
    this.message = message || 'Unable to authenticate request';
    this.statusCode = 401;
}

NotAuthorizedError.prototype = Object.create(Error.prototype);

NotAuthorizedError.prototype.constructor = NotAuthorizedError;

module.exports = NotAuthorizedError;

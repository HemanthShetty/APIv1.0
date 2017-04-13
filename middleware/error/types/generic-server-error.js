/**
 * @fileoverview Custom error object that represents generic server error(HTTP status code 500)
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 12/23/16
 */


/**
 * Custom Error object creation
 * @function
 * @param {string} message Represents the message detailing the error which occured
 */

function ServerError(message) {
    this.errorCode = 10003;
    this.message = message || 'Internal Server Error';
    this.statusCode = 500;
}

ServerError.prototype = Object.create(Error.prototype);

ServerError.prototype.constructor = ServerError;

module.exports = ServerError;

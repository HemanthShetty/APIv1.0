/**
 * @fileoverview An Error handler which which instantiates the custom error object based on type of error thrown
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 11/29/16
 */

var ServerError = require("./types/generic-server-error");
var NotAuthorizedError = require("./types/not-authorized-error");
var NotFoundError = require("./types/not-found-error");
var BadRequestError = require("./types/bad-request-error");


/**
 * Resolve the error thrown by the route controllers and create custom error objects from that
 * @param {object} err Javascript error or lambda error payload
 * @returns {object} Custom Error object to be returned back to the API client
 */
module.exports.apiErrorHandler=function(err)
{
  if(isLambdaError(err)) {
      if (err.FunctionError === 'Unhandled') {
          var error = new ServerError("Internal Server Error");
          return error;
      }
      else {
          var errorPayload=JSON.parse(err.Payload);
          var customeErrorObject = resolveError(errorPayload.errorType);
          return customeErrorObject;
      }
  }
  else
      {
          var error = resolveError(err.errorType);
          return error;
      }
};

/**
 * Create the custom error object according to the exception passed to the error handler
 * @param {string||object} errorType Type of custom error thrown to the error handler or an unhandled
 * javascript exception
 * @returns {object} Custom Error object to be returned back to the API client
 */
function resolveError(errorType) {
    //add your custom errors here
    //For example 'SSN Not Valid Error'
    switch(errorType)
    {
        case 'BadRequest':
            var error = new BadRequestError("Bad Client Request");
            return error;
        case 'NotFound':
            var error = new NotFoundError("Requested Resource Was Not Found");
            return error;
        case 'NotAuthorized':
            var error = new NotAuthorizedError("Requested Resource Was Not Found");
            return error;
        default:
            var error = new ServerError("Internal Server Error");
            return error;
    }
}

/**
 * Check if the object is an exception thrown by a lambda function which is called in the API execution chain(lambda
 * payload has the field FunctionError set to either "Handled" or "Unhandled" if an error occurs in the lambda)
 * @param {object} err Object which is sent to the error handler
 * @returns {boolean} True iff the object is an exception thrown by the lambda function
 */
function isLambdaError(err) {
    if (err.FunctionError) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * @fileoverview An Error fitting which is registered with the swagger framework to provide an error handler which
 * handles the error and sends the appropriate HTTP response.This acts like a middleware which is invoked in the
 * execution pipeline just before the response is sent back to the caller.
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 12/23/16
 */
'use strict';

var debug = require('debug')('swagger:json_error_handler');
var ServerError = require("../error/types/generic-server-error");
var ClientError = require("../error/types/bad-request-error");
var util = require('util');

/**
 * Returns a function which is registered as the error handler by the swagger framework.
 * @param {object} fittingDef Object created by swagger framework which represents the fitting defination
 * @param {object} bagpipes Array of error objects created by swagger framework on input validation error
 * @returns {function} A function which is called on error
 */
module.exports = function create(fittingDef, bagpipes) {

    debug('config: %j', fittingDef);

    /**
     * Returns a HTTP response back to the swagger framework which is eventually returned back to the API client
     * @param {object} fittingDef Object created by swagger framework which represents the fitting definition
     * @param {object} bagpipes Object created by swagger framework which represents the bagpipe definition
     * @returns {void|function} Callback function invoked which returns the http message back to the API caller
     */
    return function error_handler(context, next) {

        if (!util.isError(context.error)) {
            return next();
        }
        var err = context.error;
        var log;
        var body;
        debug('exec: %s', context.error.message);

        if (!context.statusCode || context.statusCode < 400) {
            if (context.response && context.response.statusCode && context.response.statusCode >= 400) {
                context.statusCode = context.response.statusCode;
            } else if (err.statusCode && err.statusCode < 500) {
                context.statusCode = err.statusCode;
                delete(err.statusCode);
            }
            else {
                context.statusCode = 500;
            }
        }

        try {
            //TODO: find what's throwing here...
            if (context.statusCode === 500) {
                context.headers['Content-Type'] = 'application/json';
                if (err.message && err.errorCode) {
                    Object.defineProperty(err, 'message', {enumerable: true});
                    Object.defineProperty(err, 'errorCode', {enumerable: true});
                    delete(err.statusCode);
                    delete(context.error);
                    next(null, err);
                }
                else {
                    var serverError = new ServerError("Internal Server Error");
                    delete(serverError.statusCode);
                    delete(context.error);
                    next(null, serverError);
                }

            }
            else {
                //else - from here we commit to emitting error as JSON, no matter what.
                context.headers['Content-Type'] = 'application/json';
                if(isInputValidationError(err))
                {
                    err=formatInvalidErrorResponse(err);
                }
                else
                {
                    Object.defineProperty(err, 'message', {enumerable: true}); // include message property in response
                    Object.defineProperty(err, 'errorCode', {enumerable: true});
                }
                delete(context.error);
                next(null, JSON.stringify(err));
            }
        } catch (err2) {
            log = context.request && (
                    context.request.log
                    || context.request.app && context.request.app.log
                )
                || context.response && context.response.log;

            body = {
                message: "unable to stringify error properly",
                stringifyErr: err2.message,
                originalErrInspect: util.inspect(err)
            };
            context.statusCode = 500;

            debug('jsonErrorHandler unable to stringify error: ', err);
            if (log) log.error(err2, "onError: json_error_handler - unable to stringify error", err);

            next(null, JSON.stringify(body));
        }
    };
};

/**
 * Checks if the error generated is a type on input validation error thrown by the swagger framework.
 * @param {object} error Validation error object created by swagger framework
 * @param {string} error.message The message which provides info about the error
 * @returns {boolean} true iff the error object is a type of input validation error thrown by the swagger framework
 */
function isInputValidationError(error)
{
    if(error.message==="Validation errors")
    {
        return true;
    }
    return false;
}
/**
 * Creates an error object for invalid input which is to be returned to the API caller.
 * @param {object} error Validation error object created by swagger framework
 * @param {array} error.errors Array of error objects created by swagger framework on input validation error
 * @returns {object} error object with customized fields
 */
function formatInvalidErrorResponse(error)
{
    var clientError = new ClientError(error.errors[0].message);
    clientError.metadata={};
    clientError.metadata.code=error.errors[0].code;
    clientError.metadata.errors=error.errors[0].errors;
    delete(clientError.statusCode);
    return clientError;
}
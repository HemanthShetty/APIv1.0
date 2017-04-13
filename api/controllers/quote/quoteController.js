/**
 * @fileoverview A controller which exposes API endpoints related to Quotes/Recommended Products
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 11/15/16
 */

var errorUtil = require('../../../middleware/error/ErrorHandler.js');
var quoteService = require('./quoteService.js');

/**
 * Module which handles request to the API endpoint for getting quote
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.getQuote = function (req, res,next) {
    var userId = req.swagger.params.userId.value;
    var source = "THIRD-PARTY";
    quoteService.getQuote(userId, source).then(function (data) {
        console.log("recommendation data object is:\n");
        console.log(data);
        res.json(data);
    })
        .catch(function (error) {
            var errorResponse = errorUtil.apiErrorHandler(error);
            next(errorResponse);
        });
};

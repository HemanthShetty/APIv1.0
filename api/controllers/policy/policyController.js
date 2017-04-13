/**
 * Created by hemanthshetty on 12/7/16.
 */

var errorUtil = require('../../../middleware/error/ErrorHandler.js');
var policyService = require('./policyService.js');

/**
 * Module which handles request to the API endpoint for the policy information for a user
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.getUserPolicies = function (req, res, next) {
    var userId = req.swagger.params.userId.value;
    var source = 'THIRD-PARTY';
    policyService.getUserPolicies(userId, source).then(function (data) {
        console.log("Policy collection has been fetched successfully");
        console.log(JSON.stringify(data, null, 4));
        res.json(data);
    })
        .catch(function (error) {
            var errorResponse = errorUtil.apiErrorHandler(error);
            next(errorResponse);
        });
};

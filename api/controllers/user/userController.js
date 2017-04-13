/**
 * @fileoverview A controller which exposes API endpoints related to User
 * @author Hemanth Shetty
 * @updated Hemanth Shetty 11/15/16
 */
var errorUtil = require('../../../middleware/error/ErrorHandler.js');
var userService = require('./userService.js');

/**
 * Module which handles request to the API endpoint for getting user data
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.getUser = function (req,res,next) {
    var userId = req.swagger.params.userId.value;
    var source = 'THIRD-PARTY';
    userService.getUser(userId, source).then(function (data) {
        console.log("user has been fetched successfully");
        console.log(JSON.stringify(data, null, 4));
        res.json({'user': data});
    })
        .catch(function (error) {
            var errorResponse = errorUtil.apiErrorHandler(error);
            next(errorResponse);
        });
};

/**
 * Module which handles request to the API endpoint for creating a user
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.createUser = function (req, res, next) {
    var user = req.swagger.params.user.value;
    var source = 'THIRD-PARTY';
    userService.createUser(user, source).then(function (data) {
        console.log("user has been created successfully");
        res.setHeader('Location', '/user/' + JSON.parse(data));
        res.status(201);
        res.json({"success": true});
    })
        .catch(function (error) {
            var errorResponse = errorUtil.apiErrorHandler(error);
            next(errorResponse);
        });
};


/**
 * Module which handles request to the API endpoint for deleting a user
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.deleteUser = function (req, res, next) {
    var userId = req.swagger.params.userId.value;
    var source = 'THIRD-PARTY';
    userService.deleteUser(userId, source).then(function (data) {
        console.log("Resource Deleted Successfully:\n");
        res.status(204).send();
    })
        .catch(function (error) {
            var errorResponse = errorUtil.apiErrorHandler(error);
            next(errorResponse);
        });
};

/**
 * Module which handles request to the API endpoint for updating user details
 * @function
 * @param {Object} req
 * @param {Object} res
 * @param {Object} next
 */
module.exports.updateUser = function (req, res, next) {
    var userUpdateDetails = req.swagger.params.user.value;
    var userId = req.swagger.params.userId.value;
    var source = 'THIRD-PARTY';
    userService.updateUser(userUpdateDetails, userId, source).then(function (data) {
        console.log("Resource Updated Successfully:\n");
        res.status(200);
        res.json(JSON.parse(data.Payload));
    })
        .catch(function (error) {
            var errorResponse = errorUtil.apiErrorHandler(error);
            next(errorResponse);
        });
};

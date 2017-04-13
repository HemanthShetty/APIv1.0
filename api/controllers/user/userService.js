var lambdaHelper = require('../../helpers/lambdaHelper');
var Promise = require('bluebird');
const caseConverter = require('case-converter');
const credentials = {
    accessKeyId: "xxxxxxxx",
    secretAccessKey: "xxxxxxxx",
    region: "us-east-1"
};
var invoker = new lambdaHelper(credentials);

/**
 * Function which makes a call to AWS lambda function to create the user
 * @function
 * @param {Object} userDetails Information needed to create the user
 * @param {string} source Third party source that has made the API call
 * @return {external:Promise}  On success the promise will be resolved with
 * "the result returned from lambda function call"
 * On error the promise will be rejected with an error.
 */
module.exports.createUser = function (userDetails, source) {
    var payLoad = createUserModelMapping(userDetails, source);
    console.log("lambda request object is" + JSON.stringify(payLoad, null, 4));
    return new Promise(function (resolve, reject) {
        invoker.invoke(payLoad, 'API_V1_createUser')
            .then(function (data) {
                console.log("lambda called successfully");
                resolve(data.Payload);
            })
            .catch(function (error) {
                console.log("error occured while calling lambda function");
                reject(error);
            });
    });
};

/**
 * Function which makes a call to AWS lambda function to get the user details
 * @function
 * @param {string} userId Unique identifier of the user in the system
 * @param {string} source Third party source that has made the API call
 * @return {external:Promise}  On success the promise will be resolved with
 * "the result returned from lambda function call"
 * On error the promise will be rejected with an error.
 */
module.exports.getUser = function (userId, source) {
    var payLoad = {};
    payLoad.userId = userId;
    return new Promise(function (resolve, reject) {
        invoker.invoke(payLoad, 'API_V1_getUser')
            .then(function (data) {
                var result=JSON.parse(data.Payload);
                var user = result?getUserModelMapping(result):null;
                resolve(user);
            })
            .catch(function (error) {
                console.log(error);
                console.log("error occured while calling lambda function");
                reject(error);
            });
    });
};

/**
 * Function which makes a call to AWS lambda function to delete the user from Dynamo DB table
 * @function
 * @param {string} userId Unique identifier of the user who has to be deleted
 * @param {string} source Third party source that has made the API call
 * @return {external:Promise}  On success the promise will be resolved with
 * "the result returned from lambda function call"
 * On error the promise will be rejected with an error.
 */
module.exports.deleteUser = function (userId, source) {
    var payLoad = {};
    payLoad.userId = userId;
    return new Promise(function (resolve, reject) {
        invoker.invoke(payLoad, 'API_V1_deleteUser')
            .then(function (data) {
                resolve(data);
            })
            .catch(function (error) {
                console.log("error occured while calling lambda function");
                reject(error);
            });
    });
};
/**
 * Function which makes a call to AWS lambda function to update user details in Dynamo DB table
 * @function
 * @param {string} userId Unique identifier of the user whose details have to be updated
 * @param {string} source Third party source that has made the API call
 * @param {Object} userUpdateDetails New details with with existing user should be updated
 * @return {external:Promise}  On success the promise will be resolved with
 * "the result returned from lambda function call"
 * On error the promise will be rejected with an error.
 */
module.exports.updateUser = function (userUpdateDetails, userId, source) {
    var payLoad = {};
    payLoad = {"userId": userId, "userDetails": updateUserModelMapping(userUpdateDetails), "source": source};
    return new Promise(function (resolve, reject) {
        invoker.invoke(payLoad, 'API_V1_updateUser')
            .then(function (data) {
                console.log("data returned from lambda function");
                resolve(data);
            })
            .catch(function (error) {
                console.log("error occured while calling lambda function");
                reject(error);
            });
    });
};

function createUserModelMapping(userDetails, source) {
    var userDBModel = caseConverter.toCamelCase(userDetails);
    userDBModel.userSource = source;
    return userDBModel;
}
function updateUserModelMapping(userDetails) {
    var userDBModel = caseConverter.toCamelCase(userDetails);
    return userDBModel;
}
function getUserModelMapping(payLoad) {
    var user = {};
    user.user_id = payLoad.userId;
    user.address = caseConverter.toSnakeCase(payLoad.address);
    user.date_of_birth = payLoad.dateOfBirth;
    user.dl_dtls = caseConverter.toSnakeCase(payLoad.dlDetails);
    user.email_id = payLoad.emaild;
    user.first_name = payLoad.firstName;
    user.gender = payLoad.gender;
    user.last_name = payLoad.lastName;
    user.middle_name = payLoad.middleName;
    user.phone = caseConverter.toSnakeCase(payLoad.phone);
    user.ssn = payLoad.ssn;
    return user;
}

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
 * Function which makes a call to AWS lambda function to fetch the recommendation for the user
 * @function
 * @param {string} userId Unique identifier of the user for whom we have to fetch the recommendation
 * @param {string} source Third party source that has made the API call
 * @return {external:Promise}  On success the promise will be resolved with
 * "the result returned from lambda function call"
 * On error the promise will be rejected with an error.
 */
module.exports.getQuote = function (userId, source) {
    var payLoad = {};
    payLoad.userId = userId;
    return new Promise(function (resolve, reject) {
        invoker.invoke(payLoad, 'API_V1_getQuote')
            .then(function (data) {
                console.log("lambda called successfully");
                var quote = {};
                var result=JSON.parse(data.Payload);
                quote.recommended_products = result?result:[];
                resolve(getQuoteDBModel(quote));
            })
            .catch(function (error) {
                console.log("error occured while calling lambda function");
                reject(error);
            });
    });
};

function getQuoteDBModel(lambdaRecommendationData) {
    var data = caseConverter.toSnakeCase(lambdaRecommendationData);
    return data;
}

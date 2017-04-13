/**
 * Created by hemanthshetty on 12/7/16.
 */
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
 * Function which makes a call to AWS lambda function to get the list of all the policies for a particular user
 * @function
 * @param {string} userId Unique identifier of the user for whom we have to fetch the list of policies
 * @param {string} source Third party source that has made the API call
 * @return {external:Promise}  On success the promise will be resolved with
 * "the result returned from lambda function call"
 * On error the promise will be rejected with an error.
 */
module.exports.getUserPolicies = function (userId, source) {
    var payLoad = {};
    payLoad.customerId = userId;
    payLoad.source = "Customer-App";
    return new Promise(function (resolve, reject) {
        invoker.invoke(payLoad, 'API_V1_getCustomerPolicies')
            .then(function (data) {
                var policyCollection = getPolicyCollectionModelMapping(JSON.parse(data.Payload));
                resolve(policyCollection);
            })
            .catch(function (error) {
                console.log(error);
                console.log("error occured while calling lambda function");
                reject(error);
            });
    });
};


function getPolicyCollectionModelMapping(policyCollectionDBModel) {
    var policyCollection = {};
    policyCollection.policies = [];
    for (var policyIndex = 0; policyIndex < policyCollectionDBModel.length; policyIndex++) {
        var policy = {};
        policy.application_id = policyCollectionDBModel[policyIndex].applicationId;
        policy.ben_details = caseConverter.toSnakeCase(policyCollectionDBModel[policyIndex].benDetails);
        policy.contract_rate = policyCollectionDBModel[policyIndex].contractRate;
        policy.coverage = policyCollectionDBModel[policyIndex].coverage;
        policy.cstr_id = policyCollectionDBModel[policyIndex].cstrId;
        policy.expiration_date = getDateString(policyCollectionDBModel[policyIndex].expirationDate);
        policy.issue_state = policyCollectionDBModel[policyIndex].issueState;
        policy.owner_id = policyCollectionDBModel[policyIndex].ownerId;
        policy.payment_frequency = policyCollectionDBModel[policyIndex].paymentFrequency;
        policy.policy_id = policyCollectionDBModel[policyIndex].policyId;
        policy.policy_status = policyCollectionDBModel[policyIndex].policyStatus;
        policy.premium = policyCollectionDBModel[policyIndex].premium;
        policy.product_id = policyCollectionDBModel[policyIndex].productId;
        policy.rider_id = policyCollectionDBModel[policyIndex].riderId;
        policy.is_temporary = policyCollectionDBModel[policyIndex].isTemporary;
        policy.term = policyCollectionDBModel[policyIndex].term;
        policyCollection.policies.push(policy);
    }
    return policyCollection;
}


function getDateString(timeInMilliSeconds) {
    var date = new Date(timeInMilliSeconds);
    return date.toISOString();
}

var Promise = require('bluebird');
const AWS = require('aws-sdk');
function lambdaHelper(lambdaCredentials) {
    this.lambdaCredentials = lambdaCredentials;
}
lambdaHelper.prototype.invoke = function (payLoad, lambdaName) {
    AWS.config.update(this.lambdaCredentials);
    var lambda = new AWS.Lambda();
    var params = {
        FunctionName: lambdaName,
        Payload: JSON.stringify(payLoad, null, 4)
    };
    return new Promise(function (resolve, reject) {
        lambda.invoke(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                var payLoad=JSON.parse(data.Payload);
                if (data.FunctionError !== undefined||(payLoad!==null&&payLoad.errorType!== undefined)) {
                    console.log("error occurred while invoking lambda function");
                    data.FunctionError=(data.FunctionError==="Unhandled")?data.FunctionError:"Handled";
                    reject(data);
                }
                else {
                    console.log("lambda called successfully!");
                    console.log(data);
                    resolve(data);
                }
            }
        });
    });
};

//export the class
module.exports = lambdaHelper;

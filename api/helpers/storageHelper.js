/**
 * Created by hemanthshetty on 11/22/16.
 */
var Promise = require('bluebird');
const AWS = require('aws-sdk');
function S3StorageHelper(credentials) {
    this.S3StorageCredentials = credentials;
}

S3StorageHelper.prototype.getObject = function (payLoad) {
    AWS.config.update(this.S3StorageCredentials);
    var s3 = new AWS.S3();
    var params = {Bucket: payLoad.storageBucket, Key: payLoad.storageKey};
    return new Promise(function (resolve, reject) {
        s3.getObject(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                console.log("Object fetched from S3 bucket successfully!");
                console.log(data);
                resolve(data);
            }
        });
    });
};

S3StorageHelper.prototype.putObject = function (payLoad) {
    AWS.config.update(this.S3StorageCredentials);
    var bucket = new AWS.S3({params: {Bucket: payLoad.storageBucket}});
    var params = {Key: payLoad.storageKey, Body: payLoad.file, ContentType: payLoad.contentType};
    return new Promise(function (resolve, reject) {
        bucket.upload(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            }
            else {
                console.log("Object fetched from S3 bucket successfully!");
                console.log(data);
                resolve(data);
            }
        });
    });
};

module.exports = S3StorageHelper;

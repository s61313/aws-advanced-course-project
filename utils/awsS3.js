
AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

class awsS3 {
    constructor() {
        this.s3 = new AWS.S3({apiVersion: '2006-03-01'}); 
    }

    listBuckets() {
        return new Promise((resolve, reject) => {
            // Call S3 to list the buckets
            // Create S3 service object
            this.s3.listBuckets(function(err, data) {
                if (err) {
                    // console.log("Error", err);
                    reject();
                } else {
                    // console.log("Success", data.Buckets);
                    resolve(data.Buckets);
                }
            });    
        })        
    }
}
module.exports = awsS3;


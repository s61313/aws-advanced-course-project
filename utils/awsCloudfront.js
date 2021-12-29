
let AWS = require('aws-sdk');
const cfUtil = require('aws-cloudfront-sign')
const myUtil = require("./myUtil")
const myUtilService = new myUtil()

let keyPairId = ``;
console.log("keyPairId: " , keyPairId);
let privateKey = ``;
console.log("privateKey: " , privateKey);
let cfUrl = ``;
console.log("cfUrl: " , cfUrl);
let expiry = Date.now() + 86400000;

class awsCloudfront {
    constructor() {
      if (!awsCloudfront._instance) {
        awsCloudfront._instance = this;
      }

      return awsCloudfront._instance;        
    }

    getSignedUrl(resourceURL) {

      return new Promise(async (resolve, reject) => {
        console.log("getSignedUrl() called");  

        const signedUrl = cfUtil.getSignedUrl(resourceURL, {
          keypairId: keyPairId,
          privateKeyString: privateKey,
          expireTime: expiry
        });
        console.log("signedUrl: " , signedUrl);

        resolve({
          "signedUrl": signedUrl
        });
      })
    }   

    getSignedCookies() {

      return new Promise(async (resolve, reject) => {
        console.log("getSignedCookies() called");  
        let policy = {
          'Statement': [{
            'Resource': 'http*://' + cfUrl + '/*',
            'Condition': {
              'DateLessThan': {'AWS:EpochTime': expiry}
            }
          }]
        };
        
        let policyString = JSON.stringify(policy);

        let signer = new AWS.CloudFront.Signer(keyPairId, privateKey);
        var options = {url: "http://"+cfUrl, policy: policyString};
        signer.getSignedCookie(options, function(err, signedCookies) {
            if (err) {
                res.send(err);
            } else {    
              console.log("signedCookies: ", signedCookies);
              resolve({
                "signedCookies": signedCookies
              });                
             
            }
        });

      })
    }   

}
module.exports = awsCloudfront;



let AWS = require('aws-sdk');
const cfUtil = require('aws-cloudfront-sign')
const myUtil = require("./myUtil")
const myUtilService = new myUtil()

let keyPairId = process.env.CF_PUBLIC_KEY_PAIR_ID;
console.log("keyPairId: " , keyPairId);
let privateKey = process.env.CF_PRIVATE_KEY.replace(/\\n/g, '\n');
console.log("privateKey: " , privateKey);
let cfUrl = process.env.CF_URL;
console.log("cfUrl: " , cfUrl);
let expiry = Date.now() + 86400000;

class awsCloudfront {
    constructor() {
      if (!awsCloudfront._instance) {
        awsCloudfront._instance = this;
      }

      return awsCloudfront._instance;        
    }

    generateArticle(creator, cloudprovider, language) {

      return new Promise(async (resolve, reject) => {
        console.log("generateArticle() called");  
        await myUtilService.wait_for_second(2000);
        let article = '';
        if (cloudprovider == "aws" && language == "eng") {
          article = `<h5><span style="color:#FFA500">AWS VPC</span> by Researcher ${creator}</h5><p>This is an introduction about VPC that is AI-generated.</p>`;
        }else if (cloudprovider == "aws" && language == "zh") {
          article = `<h5><span style="color:#FFA500">AWS VPC</span> by 研究者 ${creator}</h5><p>這是一段由 AI 自動生成的 AWS VPC 介紹文章.</p>`;
        }else if (cloudprovider == "gcp" && language == "eng") {
          article = `<h5><span style="color:blue">GCP VPC</span> by Researcher ${creator}</h5><p>This is an introduction about VPC that is AI-generated.</p>`;
        }else if (cloudprovider == "gcp" && language == "zh") {
          article = `<h5><span style="color:blue">GCP VPC</span> by 研究者 ${creator}</h5><p>這是一段由 AI 自動生成的 VPC 介紹文章.</p>`;
        }

        resolve(article);
      })

    }
    getSignedUrl(videopath) {

      return new Promise(async (resolve, reject) => {
        console.log("getSignedUrl() called");  
        const resourceURL = "http://" + cfUrl + videopath;
        console.log("resourceURL: " , resourceURL);
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


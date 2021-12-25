
let AWS = require('aws-sdk');
const cfUtil = require('aws-cloudfront-sign')
const myUtil = require("./myUtil")
const myUtilService = new myUtil()

let keyPairId = `K3N3E1H9JIL236`;
let privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEA0YY0Hc1Otb8vSC0pir3CdrN0uKhkAOKxDDY/8D1+rGMggwau
jAkhpNvH+2Zj6iwAT2nFfkUjubvKrise0tfaZXBOoY5wUnC8zVqUiQSDJvQLkBGp
US4ded+/olG9uJVQ8iPqSeYuTMgXAMeVc7YhVtFuMusHVUTt+WfrjGw1UZSGRZ5h
BcdQihL2xEzBinfsTiK2p77cy7f4JqK4o8khdJ+5dEh+bEPfGCfD4i58kmi8Uh1m
JvWa++xgjoijqUS3sj35hqdjiPdxCb8ehOKiOuV7KL+/6n4BSK7lmRCDsYpJIpls
UySJ/NBKmGGRNIzlQsXxMjDwXCAbAHNkFeIPAQIDAQABAoIBAQCmwRezbFYrggig
egko+dPOYw8PdD17EvBz1q1Wh6rMimwyu9upag8TxTPJWvlEQ1bP3U+oKmC/jr1F
lt4GUnLn7tU18UZl5oHtMh0rW6MCGpMlS1klWf1tpO1Aw6uqP3RX8suhmwfYZhsg
rLe+iwLHtRDuh22jqKN5rwKiFPDuhkQtP5H7a/SY3Qsn7+gmwNv+jdKG/vkmQVAz
zvI+BLH/SaxtNvniDYJhL1jC+G1w8OdlnEh5syykbaQrhljEO73jOv/iEKplny22
neWbbv+p5AEvUIPshwV+CSAbxIANcLDLX3t7s1iGaSbe8/f9H+WPkjvHMs6v9Qpk
0VaL2kS9AoGBAPitrK02K31A+V2u26jzdCWahsvoSy1cCzgcuQkcBa3PyU1cZTFA
S1JDa1ppd0UX4nL724W23+2royMjtun9PyCnCkj+3Jv4q0VpdhwJPmrdnJc0V+oz
ku8DMGaimkvV6kb3dHMISkGTuRZhg9RuzwB7s+kN78jcxoC1CLptbNhnAoGBANex
axPru3PtdBA8r7e51SGRTDHfIEli82jNVjKrUV5VSMga/iNnaR1Uut8CKQwsQ4Fw
RYwqlo+s/QJ+vRIZCZHisPZryLI92VWsr1UAL5ITbMDbBIOSpx04mPvteN1RrNjJ
zSPC0kqZx8AxI6SwJZaGpeuHxcaaf3T5bb0BNNxXAoGAQfpyUhKJP1Y50y1Ngmn1
avSwxvD+4S4GnACi51PT/eWfVzModgTE9zKEDRzmVCKeJjvEZpm6l+huBCi5oyNZ
2GP5Spy0E33Kk0QD3jRlpxzdKxDsMms0lM2XzeNeZLiAzAtjjhGpAfUbqmB9BaPQ
sCQh+7eC4xwQXp2pjyzxMAkCgYAG+VaT+1BBTFEvYTbxQtHwVulWx3ccyFVEczcx
RjbITQugZLcI4AQXDbFJGqHHIftAySeGg64AkUBQ/1YPqr2TePftz8hacwN+8Klu
nyXqnDQs/CfmNSywFi9kHeaFiWmETOoUGO2Buf0qaqxTW9qrRklBF0++vyoV1ybE
MLDL2wKBgQClQWovfNn+DgW2k/8f88xDOmuyW58LnINdXWa39eAOi0JMx+4wk3/O
9Ez6cgCFci8z+mpIZ1Lkm2kL6DjTE4FhDNCbVTNdiixdDMdV9Lr4T2dGb9WLoB46
tE/TsmXyiQwYf8/cVwmhNIR7Okk3Vzol/rHtXAoEBRf/U6lrHWsYpQ==
-----END RSA PRIVATE KEY-----`;
let cfUrl = "mycf11.learncodebypicture.com";
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



let AWS = require('aws-sdk');
// const cfUtil = require('aws-cloudfront-sign')
// const myUtil = require("./myUtil")
// const myUtilService = new myUtil()

// let keyPairId = ``;
// console.log("keyPairId: " , keyPairId);
// let privateKey = ``;
// console.log("privateKey: " , privateKey);
// let cfUrl = ``;
// console.log("cfUrl: " , cfUrl);
// let expiry = Date.now() + 86400000;

class all {
    constructor() {
      if (!all._instance) {
        all._instance = this;
      }

      return all._instance;        
    }

    getAgenda(agendaProvider) {

      return new Promise(async (resolve, reject) => {
        console.log("getAgenda() called");  
        

        resolve({
          "signedUrl": signedUrl
        });
      })
    }   

}
module.exports = all;


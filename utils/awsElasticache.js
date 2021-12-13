
AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const {sendBatchedMessages, sendBatchedMessagesInParallel} = require("sqs-bulk-loader")();
const myUtil = require("./myUtil")
const myUtilService = new myUtil()
const mydb = require('../utils/database.js');

class awsElasticache {
    constructor() {
      if (!awsElasticache._instance) {
        awsElasticache._instance = this;
        // this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        // this.is_process_continue = false;
      }

      return awsElasticache._instance;        
    }

    // list_employee() {
    //   return new Promise((resolve, reject) => {
    //     const sql = this.get_list_employee_sql(); 
    //     // const values = [[id]];
    //     const values = [];
    //     mydb.getConnection()
    //         .awaitQuery(sql, values)
    //         .then((result) => {
    //           resolve(result);
    //         })
    //         .catch((err) => {
    //           resolve(err);
    //         });
    //   })
    // }    

}
module.exports = awsElasticache;


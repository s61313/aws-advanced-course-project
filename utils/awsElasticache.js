
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

    list_employee() {
      return new Promise((resolve, reject) => {
        const sql = this.get_list_employee_sql(); 
        // const values = [[id]];
        const values = [];
        mydb.getConnection()
            .awaitQuery(sql, values)
            .then((result) => {
              resolve(result);
            })
            .catch((err) => {
              resolve(err);
            });
      })
    }    

    get_list_employee_sql() {
      const sql = 
      `
      SELECT e.emp_no, e.first_name, e.last_name, d.dept_name, dm.mgr_no, dm.mgr_first_name, dm.mgr_last_name
      FROM employees e
      LEFT JOIN dept_emp de ON e.emp_no = de.emp_no AND de.to_date = '9999-01-01'
      LEFT JOIN departments d ON de.dept_no = d.dept_no
      LEFT JOIN (
        SELECT dm2.emp_no as 'mgr_no', e2.first_name as 'mgr_first_name', e2.last_name as 'mgr_last_name', dm2.dept_no
          FROM dept_manager dm2 
          LEFT JOIN employees e2 ON dm2.emp_no = e2.emp_no
          WHERE dm2.to_date = '9999-01-01'
      ) dm ON dm.dept_no = d.dept_no
      WHERE e.emp_no != dm.mgr_no
      ORDER BY e.emp_no
      LIMIT 10000;
      `
      return sql;
    }    

}
module.exports = awsElasticache;


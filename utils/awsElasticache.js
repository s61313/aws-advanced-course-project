
var RedisClustr = require('redis-clustr');
var RedisClient = require('redis');
const { exec } = require("child_process");
const myUtil = require("./myUtil")
const myUtilService = new myUtil()


class awsElasticache {
    constructor() {
      if (!awsElasticache._instance) {
        awsElasticache._instance = this;
        this.redis_cluster_host = process.env.REDIS_CLUSTER_HOST;
        this.redis_cluster_port = process.env.REDIS_CLUSTER_PORT;
      }

      return awsElasticache._instance;        
    }

    set(key, val) {

      return new Promise(async (resolve, reject) => {
        console.log("set() called");
        const redis_cli_script = '/home/ec2-user/aws-advanced-course-project/redis-stable/src/redis-cli';
        const val_json = JSON.stringify(val);
        var cmd_set = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} set ${key} '${val_json}'`;
        console.log("cmd_set: ", cmd_set);
        await this.execute_child_process(cmd_set);
        resolve();
      })
    }

    execute_child_process(cmd) {
      return new Promise(async (resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
          if (error) {
              console.log(`error: ${error.message}`);
              return resolve();
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              return resolve();
          }
          console.log(`stdout: ${stdout}`);
          resolve(stdout);
        });
      })
    }    

    get(key) {

      return new Promise(async (resolve, reject) => {
        console.log("get() called");  
        const redis_cli_script = '/home/ec2-user/aws-advanced-course-project/redis-stable/src/redis-cli';
        var cmd_get = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} get ${key}`;
        console.log("cmd_get: ", cmd_get);
        let stdout_json = await this.execute_child_process(cmd_get);
        var result = null;
        if (myUtilService.isJson(stdout_json)) {
          result = JSON.parse(stdout_json);
        }          
        console.log(`result: ${result}`);
        resolve(result);        

      })
    }

    del(key) {

      return new Promise((resolve, reject) => {
        console.log("del() called");  
        const redis_cli_script = '/home/ec2-user/aws-advanced-course-project/redis-stable/src/redis-cli';
        var cmd_del = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} del ${key}`;
        console.log("cmd_del: ", cmd_del);

        exec(cmd_del, (error, stdout, stderr) => {
          var result = null;
          if (error) {
              console.log(`error: ${error.message}`);
              resolve();
          }
          if (stderr) {
              console.log(`stderr: ${stderr}`);
              resolve();
          }
          console.log(`stdout: ${stdout}`);
          resolve();
        })

      })
    }

}
module.exports = awsElasticache;



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
        this.redis = this.init_redis();
        this.redis_client = null;
      }

      return awsElasticache._instance;        
    }

    init_redis() {
      var redis = new RedisClustr({
          servers: [
              {
                  host: this.redis_cluster_host,
                  port: this.redis_cluster_port
              }
          ],
          createClient: function (redis_cluster_port, redis_cluster_host) {
              // this is the default behaviour
              return RedisClient.createClient(redis_cluster_port, redis_cluster_host);
          }
      });

      // connect to redis
      // redis.on("connect", function () {
      //   console.log("connected");
      // });

      // //check the functioning
      // redis.set("framework", "AngularJS", function (err, reply) {
      //   console.log("redis.set " , reply);
      // });

      // redis.get("framework", function (err, reply) {
      //   console.log("redis.get ", reply);
      // });

      return redis;
    }

    init_redis_client() {

      return new Promise((resolve, reject) => {
        console.log("init_redis_client() called");
        this.redis_client = this.redis.createClient(this.redis_cluster_port, this.redis_cluster_host);

        //catch all errors
        this.redis_client.on("error", function (err) {
          console.log("redis failed to connect: " + err);
          resolve();
        });
  
        //connect to redis
        this.redis_client.on("connect", function (err, reply) {
          console.log("redis connected.");
          resolve();
        });

      })
    }

    set(key, val) {

      return new Promise(async (resolve, reject) => {
        console.log("set() called");
        const redis_cli_script = '/home/ec2-user/aws-advanced-course-project/redis-stable/src/redis-cli';
        // const val_json = JSON.stringify(val);
        // const jsonfilename = 'myjsonfile.json';
        // await myUtilService.write_to_file(jsonfilename, val_json);
        // await myUtilService.read_from_file(jsonfilename);
        // var cmd_set = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} set ${key} '${val_json}'`;
        // var cmd_set = `${redis_cli_script} -c -x -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} set ${key} < ${jsonfilename}`;
        // console.log("cmd_set: ", cmd_set);

        for (let i = 0; i < val.length ;i++) {
          let emp = val[i];
          let emp_json = JSON.stringify(emp);
          var cmd_hset = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} hset ${key} ${emp.emp_no} '${emp_json}'`;
          console.log("cmd_hset: ", cmd_hset);
          let stdout_result = await this.execute_child_process(cmd_hset);
        }
        resolve();
        
        // exec(cmd_set, (error, stdout, stderr) => {
        //   if (error) {
        //       console.log(`error: ${error.message}`);
        //       resolve();
        //   }
        //   if (stderr) {
        //       console.log(`stderr: ${stderr}`);
        //       resolve();
        //   }
        //   console.log(`stdout: ${stdout}`);
        //   resolve();
        // });
        
        // console.log("set() called");  
        // const val_json = JSON.stringify(val);
        // this.redis_client.set(key, val_json, function (err, reply) {
        //   console.log("redis_client.set err: " , err);
        //   console.log("redis_client.set reply: " , reply);
        //   resolve(reply);
        // });

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
        var cmd_hgetall = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} hgetall ${key}`;
        console.log("cmd_hgetall: ", cmd_hgetall);
        let stdout_json = await this.execute_child_process(cmd_hgetall);
        
        if (stdout_json) {
          let stdout_obj = stdout_json.split(/\r?\n/);
          console.log("cmd_hgetall list: ", stdout_obj);  
          let emp_list = [];
          for (let i = 0; i < stdout_obj.length ;i+=2) {
            let emp_no = stdout_obj[i];
            if (emp_no == '') continue;
            let emp_json = stdout_obj[i+1];
            console.log("emp_no: ", emp_no);  
            console.log("emp_json: ", emp_json);  
            // let emp = JSON.parse(emp_json);
            // emp_list.push(emp);
          }
          console.log("emp_list: ", emp_list);  
          if (emp_list.length > 0) {
            resolve(emp_list);
          }else {
            resolve(); 
          }
        }else {
          resolve();
        }

        // const redis_cli_script = '/home/ec2-user/aws-advanced-course-project/redis-stable/src/redis-cli';
        // var cmd_get = `${redis_cli_script} -c -h ${this.redis_cluster_host} -p ${this.redis_cluster_port} get ${key}`;
        // console.log("cmd_get: ", cmd_get);
          
        // exec(cmd_get, (error, stdout, stderr) => {
        //   var result = null;
        //   if (error) {
        //       console.log(`error: ${error.message}`);
        //       resolve();
        //   }
        //   if (stderr) {
        //       console.log(`stderr: ${stderr}`);
        //       resolve();
        //   }
        //   console.log(`stdout: ${stdout}`);
        //   if (myUtilService.isJson(stdout)) {
        //     result = JSON.parse(stdout);
        //   }          
        //   console.log(`result: ${result}`);
        //   resolve(result);
        // })

        // this.redis_client.get(key, function (err, reply) {
        //   console.log("redis_client.get 1 ", reply);
        //   var result = null;
        //   if (reply) {
        //     result = JSON.parse(reply);
        //   }
        //   resolve(result);  
        // });

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
          
        // this.redis_client.del(key, function (err, reply) {
        //   console.log("redis_client.del", reply);
        //   resolve();
        // });

      })
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


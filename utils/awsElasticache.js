
var RedisClustr = require('redis-clustr');
var RedisClient = require('redis');

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

      return new Promise((resolve, reject) => {
        console.log("set() called");  
        const val_json = JSON.stringify(val);
        this.redis_client.set(key, val_json, function (err, reply) {
          console.log("redis_client.set " , reply);
          resolve(reply);
        });

      })
    }

    get(key) {

      return new Promise((resolve, reject) => {
        console.log("get() called");  
          
        this.redis_client.get(key, function (err, reply) {
          // console.log("redis_client.get 1 ", reply);
          const val_json = JSON.parse(reply);
          console.log("redis_client.get 2 ", val_json);
          resolve(val_json);
        });

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


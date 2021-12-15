
var RedisClustr = require('redis-clustr');
var RedisClient = require('redis');
// var RedisCluster = require('redis-cluster').clusterClient;
var RedisCluster = require('redis-cluster').poorMansClusterClient;

class awsElasticache {
    constructor() {
      if (!awsElasticache._instance) {
        awsElasticache._instance = this;
        this.redis_cluster_host = process.env.REDIS_CLUSTER_HOST;
        this.redis_cluster_port = process.env.REDIS_CLUSTER_PORT;
        this.redis = this.init_redis();
        this.redis_client = null;

        // 
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
        var cluster_url = this.redis_cluster_host + ":" + this.redis_cluster_port;
        var cluster = [
          {name: 'redis01', link: cluster_url, slots: [   0, 5461], options: {max_attempts: 3}},
          {name: 'redis02', link: cluster_url, slots: [5462, 10922], options: {max_attempts: 3}},
          {name: 'redis03', link: cluster_url, slots: [10923, 16383], options: {max_attempts: 3}}
        ];

        this.redis_client = poorMansClusterClient(cluster);

        this.redis_client.set('foo', 'bar', function (err, reply) {
          if (err) throw err;
          assert.equal(reply,'OK');
        
          this.redis_client.get('foo', function (err, reply) {
            if (err) throw err;
            assert.equal(reply, 'bar');
          });
        });        


        // this.redis_client = this.redis.createClient(this.redis_cluster_port, this.redis_cluster_host);

        // //catch all errors
        // this.redis_client.on("error", function (err) {
        //   console.log("redis failed to connect: " + err);
        //   resolve();
        // });
  
        // //connect to redis
        // this.redis_client.on("connect", function (err, reply) {
        //   console.log("redis connected.");
        //   resolve();
        // });

      })
    }

    set(key, val) {

      return new Promise((resolve, reject) => {
        console.log("set() called");  
        const val_json = JSON.stringify(val);
        this.redis_client.set(key, val_json, function (err, reply) {
          console.log("redis_client.set err: " , err);
          console.log("redis_client.set reply: " , reply);
          resolve(reply);
        });

      })
    }

    get(key) {

      return new Promise((resolve, reject) => {
        console.log("get() called");  
          
        this.redis_client.get(key, function (err, reply) {
          console.log("redis_client.get 1 ", reply);
          var result = null;
          if (reply) {
            result = JSON.parse(reply);
          }
          resolve(result);  
        });

      })
    }

    del(key) {

      return new Promise((resolve, reject) => {
        console.log("del() called");  
          
        this.redis_client.del(key, function (err, reply) {
          console.log("redis_client.del", reply);
          resolve();
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


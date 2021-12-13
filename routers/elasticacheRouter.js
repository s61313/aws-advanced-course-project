const express = require("express");
const router = express.Router();
const awsElasticache = require("../utils/awsElasticache");
const awsElasticacheService = new awsElasticache();

router.get("/elasticache/list_employee", async function (req, res) {
  console.log("/elasticache/list_employee called");
  // var sqs_queue_url = req.query.sqs_queue_url;
  const start_time = new Date().getTime();
  const result = await awsElasticacheService.list_employee();
  const end_time = new Date().getTime();
  let processed_time = (end_time - start_time) / 1000;
  res.send({
    "result": result,
    "processed_time": processed_time
  });

});

module.exports = router;
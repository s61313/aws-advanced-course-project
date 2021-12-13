const express = require("express");
const router = express.Router();
const awsElasticache = require("../utils/awsElasticache");
const awsElasticacheService = new awsElasticache();

router.get("/elasticache/list_employee", async function (req, res) {
  console.log("/elasticache/list_employee called");
  // var sqs_queue_url = req.query.sqs_queue_url;

  const result = await awsElasticacheService.list_employee();
  res.send(result);

});

module.exports = router;
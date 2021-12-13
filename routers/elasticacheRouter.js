const express = require("express");
const router = express.Router();
const empModel = require("../models/empModel");
const empModelService = new empModel();

router.get("/elasticache/list_employee", async function (req, res) {
  console.log("/elasticache/list_employee called");
  // var sqs_queue_url = req.query.sqs_queue_url;
  const start_time = new Date().getTime();
  const result = await empModelService.list_employee();
  const end_time = new Date().getTime();
  let processed_time = (end_time - start_time) / 1000;
  res.send({
    "result": result,
    "processed_time": processed_time
  });

});

router.get("/elasticache/clean", async function (req, res) {
  console.log("/elasticache/clean called");
  await empModelService.clean_cache();
  res.send({});
});

module.exports = router;
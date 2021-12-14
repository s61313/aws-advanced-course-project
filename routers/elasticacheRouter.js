const express = require("express");
const router = express.Router();
const empModel = require("../models/empModel");
const empModelService = new empModel();

router.get("/elasticache/list_employee", async function (req, res) {
  console.log("/elasticache/list_employee called");
  var is_cache = req.query.is_cache;
  const start_time = new Date().getTime();
  var result;
  if (is_cache) {
    result = await empModelService.list_employee_cached();
  }else {
    result = await empModelService.list_employee();
  }
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
const express = require("express");
const router = express.Router();
const empModel = require("../models/empModel");
const empModelService = new empModel();
const awsElasticache = require("../utils/awsElasticache");
const awsElasticacheService = new awsElasticache();
const emp_list_key = "emp_list";

router.get("/elasticache/list_employee", async function (req, res) {
  console.log("/elasticache/list_employee called");
  var is_cache = req.query.is_cache;
  const start_time = new Date().getTime();
  console.log("is_cache: " , is_cache);
  console.log(typeof is_cache);
  if (is_cache == 'true') {
    // get cache 
    const result_cached = await awsElasticacheService.get(emp_list_key);
    if (result_cached) {
      console.log("emp_list_cache exists");
      res.send({"result": result_cached,"processed_time": ((new Date().getTime() - start_time) / 1000)});
    }

    // main logic
    console.log("emp_list_cache not exists");
    const result = await empModelService.list_employee_cached();
    // set cache 
    await awsElasticacheService.set(emp_list_key, result);
    res.send({"result": result,"processed_time": ((new Date().getTime() - start_time) / 1000)});

  }else {
    const result = await empModelService.list_employee();
    res.send({"result": result,"processed_time": ((new Date().getTime() - start_time) / 1000)});
  } 

});

router.get("/elasticache/clean", async function (req, res) {
  console.log("/elasticache/clean called");
  await empModelService.clean_cache();
  res.send({});
});

module.exports = router;
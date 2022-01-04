const express = require("express");
const router = express.Router();
const awsCloudfront = require("../utils/awsCloudfront");
const awsCloudfrontService = new awsCloudfront();
const myUtil = require("../utils/myUtil")
const myUtilService = new myUtil();
const ticketModel = require("../models/ticketModel.js");
const ticketModelService = new ticketModel();
const awsElasticache = require("../utils/awsElasticache");
const awsElasticacheService = new awsElasticache();


router.get("/all/agenda", async function (req, res) {
  console.log("/all/agenda called");
  const start_time = new Date().getTime();
  var agendaPovider = req.query.agendaPovider;
  var agendaPovider_cache_key = agendaPovider;

  // get cache 
  const result_cached = await awsElasticacheService.hget(agendaPovider_cache_key);
  if (result_cached) {
    console.log("agendaPovider_cache_key exists");
    res.send({"result": result_cached,"processed_time": myUtilService.get_process_time(start_time)});
    return;
  }

  // main logic
  const result = await ticketModelService.get_agenda_by_agenda_provider(agendaPovider);
  // set cache 
  await awsElasticacheService.hset(agendaPovider_cache_key, result);

  res.send({"result": result,"processed_time": myUtilService.get_process_time(start_time)});
});

router.get("/all/cleanall", async function (req, res) {
  console.log("/all/cleanall called");
  await awsElasticacheService.cleanallcache();
  res.send({});
});

module.exports = router;
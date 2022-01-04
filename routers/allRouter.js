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
const elbController = require("../controllers/elbController.js");


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

router.get("/all/buyticket", async function (req, res) {
  console.log("/all/buyticket called");
  var agendaPovider = req.query.agendaPovider;

  let resBuyTicket = await elbController.buyTicket(3000);

  // insert to database 
  let result_buy_ticket = await ticketModelService.get_insert_bought_ticket(agendaPovider); 
  console.log("result_buy_ticket: ", result_buy_ticket);

  // DO-THIS: send to sqs 
  var end_time = new Date().getTime();
  var process_time_sec = (end_time - req.query.req_issued_time)/1000;
  res.send({
    "ticket_id": resBuyTicket.ticket_id,
    "process_time": process_time_sec
  });
});



module.exports = router;
const express = require("express");
const router = express.Router();
const awsCloudfront = require("../utils/awsCloudfront");
const awsCloudfrontService = new awsCloudfront();
const myUtil = require("../utils/myUtil")
const myUtilService = new myUtil();
const ticketModel = require("../models/ticketModel.js");
const ticketModelService = new ticketModel();

router.get("/all/agenda", async function (req, res) {
  console.log("/all/agenda called");
  const start_time = new Date().getTime();
  var agendaPovider = req.query.agendaPovider;
  const result = await ticketModelService.get_agenda_by_agenda_provider(agendaPovider);
  res.send({"result": result,"processed_time": myUtilService.get_process_time(start_time)});
});

module.exports = router;
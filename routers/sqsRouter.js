const express = require("express");
const router = express.Router();
const elbController = require("../controllers/elbController.js");
const awsSQS = require("../utils/awsSQS")
const awsSQSService = new awsSQS()
var is_process_continue = false;

router.get("/sqs/sendmsg", async function (req, res) {
  console.log("/sqs/sendmsg called");
  var sqs_queue_url = req.query.sqs_queue_url;
  var sqs_msg_number = req.query.sqs_msg_number;
  var process_time_ms = req.query.process_time_ms;
  const sqs_msg_result = await awsSQSService.send_msg_batch(sqs_queue_url, sqs_msg_number, process_time_ms)

  res.send(sqs_msg_result)

});


router.get("/sqs/attrtibute", async function (req, res) {
  console.log("/sqs/attrtibute called");
  var sqs_queue_url = req.query.sqs_queue_url;
  const queue_attr = await awsSQSService.get_queue_attr(sqs_queue_url)
  res.send(queue_attr)
});

router.get("/sqs/process/continue/stop", async function (req, res) {
  console.log("/sqs/process/continue/stop called");
  is_process_continue = false;
  res.send({"result":"Done"});
});

router.get("/sqs/process/continue", async function (req, res) {
  console.log("/sqs/process/continue called");
  var sqs_queue_url = req.query.sqs_queue_url;
  is_process_continue = true;

  while (is_process_continue) {
    await awsSQSService.process_queue_msg(sqs_queue_url);
  }
  
  res.send({"result":"Done"});
});

router.get("/sqs/process", async function (req, res) {
  console.log("/sqs/process called");
  var sqs_queue_url = req.query.sqs_queue_url;
  await awsSQSService.process_queue_msg(sqs_queue_url);
  res.send({"result":"Done"});
});




module.exports = router;
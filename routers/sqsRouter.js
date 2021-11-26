const express = require("express");
const router = express.Router();
const elbController = require("../controllers/elbController.js");
const awsSQS = require("../utils/awsSQS")
const awsSQSService = new awsSQS()

router.get("/sqs/sendmsg", async function (req, res) {
  console.log("/sqs/sendmsg called");
  // var sqs_queue_url = "https://sqs.us-east-1.amazonaws.com/344458213649/sqs-for-lambda"
  // var sqs_msg_number = 50;

  var sqs_queue_url = req.query.sqs_queue_url;
  var sqs_msg_number = req.query.sqs_msg_number;

  const sqs_msg_result = await awsSQSService.send_msg_batch(sqs_queue_url, sqs_msg_number)
  res.send(sqs_msg_result)

  // var sqs_msg_round = 100;
  // var sqs_msg_result = [];
  // while (sqs_msg_round > 0) {
  //   const res_send_msg = await awsSQSService.send_msg(sqs_queue_url)
  //   sqs_msg_result.push(res_send_msg)
  //   sqs_msg_round--;
  // }
  // res.send(sqs_msg_result)

  
});


module.exports = router;
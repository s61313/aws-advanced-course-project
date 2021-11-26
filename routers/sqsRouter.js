const express = require("express");
const router = express.Router();
const elbController = require("../controllers/elbController.js");
const awsSQS = require("../utils/awsSQS")
const awsSQSService = new awsSQS()

router.get("/sqs/sendmsg", async function (req, res) {
  console.log("/sqs/sendmsg called");
  var sqs_queue_url = req.query.sqs_queue_url;
  var sqs_msg_number = req.query.sqs_msg_number;

  const sqs_msg_result = await awsSQSService.send_msg_batch(sqs_queue_url, sqs_msg_number)

  res.send(sqs_msg_result)

});


router.get("/sqs/attrtibute", async function (req, res) {
  console.log("/sqs/attrtibute called");
  var sqs_queue_url = req.query.sqs_queue_url;
  const queue_attr = await awsSQSService.get_queue_attr(sqs_queue_url)
  res.send(queue_attr)
});

module.exports = router;
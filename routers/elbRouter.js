const express = require("express");
const router = express.Router();
const awsS3Service = require("../utils/awsS3");
const elbController = require("../controllers/elbController.js");
const axios = require('axios'); 

// router.use(cookieParser());
router.get("/elb/buyticket", async function (req, res) {
  console.log("/elb/buyticket caclled");
  let resBuyTicket = await elbController.buyTicket(3000);
  var end_time = new Date().getTime();
  var process_time_sec = (end_time - req.query.req_issued_time)/1000;
  res.send({
    "ticket_id": resBuyTicket.ticket_id,
    "process_time": process_time_sec
  });
});

// router.use(cookieParser());
router.get("/elb/vip/buyticket", async function (req, res) {
  console.log("/elb/vip/buyticket caclled");
  let resBuyTicket = await elbController.buyTicket(3000);
  var end_time = new Date().getTime();
  var process_time_sec = (end_time - req.query.req_issued_time)/1000;
  res.send({
    "ticket_id": resBuyTicket.ticket_id,
    "process_time": process_time_sec
  });
});

router.get("/elb/az", async function (req, res) {
  console.log("/elb/az called");
  const url_metadata = 'http://169.254.169.254/latest/meta-data/placement/availability-zone';
  const response = await axios.get(url_metadata)
  console.log(response.data);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");

  res.send(response.data);
});

module.exports = router;
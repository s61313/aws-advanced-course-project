const express = require("express");
const router = express.Router();
const awsS3Service = require("../utils/awsS3");
const elbController = require("../controllers/elbController.js");
// const cookieParser = require("cookie-parser");

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

module.exports = router;
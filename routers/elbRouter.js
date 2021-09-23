const express = require("express");
const router = express.Router();
const awsS3Service = require("../utils/awsS3");
// const registerController = require("../controllers/registerController.js");
// const cookieParser = require("cookie-parser");

// router.use(cookieParser());
router.get("/elb/buyticket", async function (req, res) {
  console.log("/elb/buyticket caclled");
  var resMsg = "finished";
  res.send(resMsg);
});

module.exports = router;
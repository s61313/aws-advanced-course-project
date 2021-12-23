const express = require("express");
const router = express.Router();
const awsCloudfront = require("../utils/awsCloudfront");
const awsCloudfrontService = new awsCloudfront();
const myUtil = require("../utils/myUtil")
const myUtilService = new myUtil();

router.get("/cloudfront/coursevideo", async function (req, res) {
  console.log("/cloudfront/coursevideo called");
  const start_time = new Date().getTime();
  var videourl = req.query.videourl;
  const result = await awsCloudfrontService.getSignedUrl(videourl);
  res.send({"result": result,"processed_time": myUtilService.get_process_time(start_time)});
});

module.exports = router;
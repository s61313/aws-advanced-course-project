const express = require("express");
const router = express.Router();
const awsS3Service = require("../utils/awsS3");
// const registerController = require("../controllers/registerController.js");
// const cookieParser = require("cookie-parser");

// router.use(cookieParser());
router.get("/cloudwatch/metrics", async function (req, res) {
  console.log("cloudwatch router caclled");
  let awsS3 = new awsS3Service();
  const bucketResult = await awsS3.listBuckets();
  console.log("bucketResult: ", bucketResult);
  // var resMsg = await registerController.findUserByNameWithoutPwd(req.params.username);
  // res.send(resMsg);
});

module.exports = router;
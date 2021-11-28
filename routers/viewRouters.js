const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/elb", (req, res) => {
  res.render("elb");
});

router.get("/elbex1", (req, res) => {
  res.render("elbex1");
});

router.get("/sqs_lambda", (req, res) => {
  res.render("sqs_lambda");
});

router.get("/elb_stickiness", (req, res) => {
  res.render("elb_stickiness");
});



module.exports = router;
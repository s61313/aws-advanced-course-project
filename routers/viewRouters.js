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

router.get("/sqs_asg", (req, res) => {
  res.render("sqs_asg");
});

router.get("/sqs_asg_tool", (req, res) => {
  res.render("sqs_asg_tool");
});

router.get("/sqs_lambda", (req, res) => {
  res.render("sqs_lambda");
});

router.get("/elasticache", (req, res) => {
  res.render("elasticache");
});

router.get("/elb_stickiness", (req, res) => {
  res.render("elb_stickiness");
});

router.get("/elasticache_exercise", (req, res) => {
  res.render("elasticache_exercise");
});

router.get("/cloudfront", (req, res) => {
  res.render("cloudfront");
});

module.exports = router;
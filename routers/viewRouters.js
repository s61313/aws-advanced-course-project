const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/cloudwatch", (req, res) => {
  res.render("cloudwatch");
});

router.get("/elb", (req, res) => {
  res.render("elb");
});

module.exports = router;
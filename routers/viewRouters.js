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

module.exports = router;
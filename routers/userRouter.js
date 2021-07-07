const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const cookieParser = require("cookie-parser");
const statusController = require('../controllers/statusController.js');
router.use(cookieParser());

router.use(registerController.verifyJwtToken) // jwt validation middle ware 

router.post("/users/:username/status", async function (req, res) {
  const resMsg = await statusController.setStatus(req.body.username, req.body.status);
  res.send(resMsg);
});

router.put("/users/:username/offline", async function (req, res) {
  var resMsg = await registerController.logout(req.params.username, req.headers.authorization);
  res.clearCookie("token");
  res.send(resMsg);
});

module.exports = router;

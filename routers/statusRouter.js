const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");
const statusController = require("../controllers/statusController.js");
router.use(cookieParser());

router.get("/status/:username", async function (req, res) {
  const resMsg = await statusController.getStatusHistoryByUsername(
    req.params.username
  );
  res.send(resMsg);
});

module.exports = router;
const express = require("express");
const router = express.Router();
const fireReportController = require("../controllers/fireReportController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(require("../controllers/registerController.js").verifyJwtToken); // jwt validation middle ware


router.post("/fireReports", async function (req, res) {
  console.log("create a fire report");
  const resMsg = await fireReportController.sendFireReport(
    req.body.reporterUsername,
    req.body.fireReportLocation
  );
  res.send(resMsg);
});

router.get("/fireReports", async function (req, res) {

  const resMsg = await fireReportController.getFireReports(
    req.query.fireReportStatus,
    req.query.reporterUsername
  );
  res.send(resMsg);
});

router.get("/fireReports/:fireReportId", async function (req, res) {
  const resMsg = await fireReportController.getFireReportById(req.params.fireReportId);
  res.send(resMsg);
});

router.put("/fireReports/:fireReportId", async function (req, res) {
  var resMsg = await fireReportController.updateFireReportFireStatusById(
    req.params.fireReportId,
    req.query.fireReportStatus,
    req.query.adminCheck,
    req.query.citizenCheck,
  );
  res.send(resMsg);
});


module.exports = router;

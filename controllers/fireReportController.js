const SocketioService = require("../utils/socketio");
const FireReportModel = require("../models/fireReportModel");
const HttpResponse = require("./httpResponse.js");

async function sendFireReport(reporterUsername, fireReportLocation) {
  if (reporterUsername === "" || fireReportLocation === undefined) {
    return new HttpResponse("missing fire report information, please try again", "missingFireReportInformation", "true");
  }
  const resMsg = await FireReportModel.create(reporterUsername, fireReportLocation)
    .then((dbResult) => {
      return new HttpResponse("FireReport is created.", "fireReportCreated", "false", { insertId: dbResult.insertId });
    });
    await SocketioService.getInstance().sendFireReportToUser(
    "fireReportNotification",
    "fireReportAdmin"
  );
  return resMsg;
}


async function getFireReports(fireReportStatus, reporterUsername) {
  console.log("get unresolved fire reports");
  const resMsg = await getFireReportsHelper(fireReportStatus, reporterUsername);
  return resMsg;
}

function getFireReportsHelper(fireReportStatus, reporterUsername) {
  return FireReportModel.getFireReports(fireReportStatus, reporterUsername)
    .then((dbResult) => {
      return new HttpResponse(
        "fire reports are queried.",
        "fireReportsQueried",
        "false",
        dbResult
      );
    });
}

function getFireReportById(fireReportId) {
  return FireReportModel.getFireReportById(fireReportId)
    .then((dbResult) => {
      return new HttpResponse(
        "a fire report is queried.",
        "fireReportQueried",
        "false",
        dbResult
      );
    })
}

async function updateFireReportFireStatusById(fireReportId, fireReportStatus, adminCheck, citizenCheck) {
  var resMsg = await FireReportModel.updateFireReportFireStatusById(fireReportId, fireReportStatus, adminCheck, citizenCheck)
    .then((dbResult) => {return new HttpResponse("a fire report is updated.", "fireReportUpdated", "false", dbResult);});
  const queryResult= await FireReportModel.getReporterUsernameByFireReportId(fireReportId);
  const receiverName = queryResult[0].reporterUsername;
  if (fireReportStatus) {
    await SocketioService.getInstance().sendFireReportToUser("fireReportUpdateNotification", receiverName);
    if (fireReportStatus === "approved") {
      const fireReportLocation = await FireReportModel.getFireReportLocationByFireReportId(fireReportId);
      console.log(fireReportLocation)
      await SocketioService.getInstance().sendFireMarkerToMap(fireReportLocation);
    }
  }
  return resMsg;
}

module.exports = {
  sendFireReport: sendFireReport,
  getFireReports: getFireReports,
  getFireReportById: getFireReportById,
  updateFireReportFireStatusById: updateFireReportFireStatusById,
};
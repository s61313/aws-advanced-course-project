const SocketioService = require("../utils/socketio");
const HttpResponse = require("./httpResponse.js");
const Em = require("../models/emergencyContactModel");


async function setEmergencyContact(username, phonenumber, address, emergencycontact) {
  const resMsg = await Em.create(username, phonenumber, address, emergencycontact)
    .then((dbResult) => {
      console.log("emergencyContact table updated row: " + dbResult.affectedRows);
      return new HttpResponse(
        "EmergencyContact is created.",
        "emergenctContactCreated",
        "false",
        { insertId: dbResult.insertId }
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
  await SocketioService.getInstance().pendingRequestUpdateEMcolor(username);
  await SocketioService.getInstance().sendECrequest(emergencycontact);
  return resMsg;
}  

async function acceptEmergencyContactRequest(requestusername, username) {

  const resMsg = await Em.accept(requestusername, username)
    .then((dbResult) => {
      console.log("emergencyContact table updated row: " + dbResult.affectedRows);
      return new HttpResponse(
        "EmergencyContact request accepted.",
        "emergenctContactConfirmed",
        "false",
        { insertId: dbResult.insertId }
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });

  await SocketioService.getInstance().acceptECrequest(requestusername);
  return resMsg;
}

async function declineEmergencyContactRequest(requestusername, username) {

  const resMsg = await Em.deny(requestusername, username)
    .then((dbResult) => {
      console.log("emergencyContact table updated row: " + dbResult.affectedRows);
      return new HttpResponse(
        "EmergencyContact request declined.",
        "emergenctContactDeclined",
        "false",
        { insertId: dbResult.insertId }
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });

  await SocketioService.getInstance().declineECrequest(requestusername);
  return resMsg;
}

async function acknowledgeEmergencyContactAlert(requestusername, username) {

  const resMsg = await Em.acknowledge(requestusername, username)
    .then((dbResult) => {
      console.log("emergencyContact table updated row: " + dbResult.affectedRows);
      return new HttpResponse(
        "EmergencyContact alert noted.",
        "emergenctAlertNoted",
        "false",
        { insertId: dbResult.insertId }
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });

  await SocketioService.getInstance().acknowledgeECrequest(requestusername);
  return resMsg;
}



async function findIfUserHasPendingRequest(username) {
  const res = await Em.findUserWithPendingEMRequest(username)
    .then((dbResult) => {
      return new HttpResponse(
        "found User with pending request",
        "found User",
        "false",
        dbResult
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
  return res;
}

async function getButtonStatus(username) {
  const res = await Em.getButtonStatus(username)
    .then((dbResult) => {
      return new HttpResponse(
        "found button status",
        "found button status",
        "false",
        dbResult
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
  return res;
}

async function alert(username) {
  const data = await Em.findEmergencyContactByUsername(username);
  console.log(data[0].emergencycontact)
  const res = await Em.alert(username)
    .then((dbResult) => {
      return new HttpResponse(
        "emergency contact alerted",
        "alerted",
        "false",
        dbResult
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
  await SocketioService.getInstance().sendECrequest(data[0].emergencycontact);
  return res;
}

module.exports = {
  setEmergencyContact: setEmergencyContact,
  acceptEmergencyContactRequest: acceptEmergencyContactRequest,
  findIfUserHasPendingRequest: findIfUserHasPendingRequest,
  declineEmergencyContactRequest: declineEmergencyContactRequest,
  acknowledgeEmergencyContactAlert: acknowledgeEmergencyContactAlert,
  getButtonStatus: getButtonStatus,
  alert: alert,
};
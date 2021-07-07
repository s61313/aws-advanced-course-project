const statusModel = require("../models/statusModel.js");
const HttpResponse = require("./httpResponse.js");
const SocketioService = require("../utils/socketio");

async function setStatus(username, status) {
    var resMsg;
    resMsg = await statusModel
    .setNewStatus(username, status)
    .then(()=> {
        return new HttpResponse("Status set successfully", "setStatusSuccess", "false", {"username":username, "status": status});
    }) 
    .catch((err) => {
        return new HttpResponse(
          "Error setting status.",
          "setStatusFailed",
          "true",
          err
        );
      });

    // broadcast to all user
    await SocketioService.getInstance().updateStatus(status, username);
    return resMsg;
}


async function getStatusHistoryByUsername(username) {
  resMsg = await statusModel
    .getStatusHistoryByUsername(username)
    .then((dbResult) => {
      return new HttpResponse(
        "User Status Search OK.",
        "userStatusSearchOk",
        "false",
        dbResult
      );
    })
    .catch((err) => {
      return new HttpResponse(
        "User Status Search Failed.",
        "userStatusSearchFailed",
        "true",
        err
      );
    });
  return resMsg;
}

module.exports = {
  setStatus: setStatus,
  getStatusHistoryByUsername: getStatusHistoryByUsername,
};
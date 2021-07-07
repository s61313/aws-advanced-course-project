const SocketioService = require("../utils/socketio");
const HttpResponse = require("./httpResponse.js");
const MsgPrivate = require("../models/msgPrivateModel");

async function sendPrivateMsg(content, sendingUsername, senderStatus, receivingUsername, receiverStatus) {
  // step01: store msg in db
  const resMsg = await MsgPrivate.create(content, sendingUsername, senderStatus, receivingUsername, receiverStatus)
    .then((dbResult) => {
      console.log("PrivateMsg table updated row: " + dbResult.affectedRows);
      return new HttpResponse(
        "PrivateMsg is created.",
        "privateMsgCreated",
        "false",
        { insertId: dbResult.insertId }
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });

  const insertId = resMsg.data.insertId;
  if (insertId == undefined) {
    return resMsg;
  }

  // step02: get the newly-created Msg from db (for its timestamp value)
  const msgForPush = await MsgPrivate.findMsgById(insertId);

  // step03: push msg to two users
  await SocketioService.getInstance().pushMsgToUser(msgForPush, "notification", receivingUsername);
  await SocketioService.getInstance().pushMsgToUser(msgForPush, "private message", sendingUsername);
  await SocketioService.getInstance().pushMsgToUser(msgForPush, "private message", receivingUsername);

  return resMsg;
}

async function findSendersWithUnreadMsgsByReceiver(username) {
    const res = await MsgPrivate.findSendersWithUnreadMsgsByReceiver(username)
      .then((dbResult) => {
        return new HttpResponse(
          "found senders with unread msgs",
          "foundSenders",
          "false",
          dbResult
        );
      })
      .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
      });
    return res;
}

async function findMsgsBetween(keywords, sendingUsername, receivingUsername) {
    var resMsg;
    if (keywords) {
        resMsg = await findMsgsBetweenByKeywordsHelper(keywords, sendingUsername, receivingUsername);
    } else {
        resMsg = await findMsgsBetweenHelper(sendingUsername, receivingUsername);
    }
    return resMsg;
}

function findMsgsBetweenHelper(sendingUsername, receivingUsername) {
    return MsgPrivate.findMsgsBetween(sendingUsername, receivingUsername)
    .then((dbResult) => {
        return new HttpResponse("found private msgs between sender and receiver.", "PrivateMsgsFound", "false", dbResult);
    })
    .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
    });
}

function findMsgsBetweenByKeywordsHelper(keywords, sendingUsername, receivingUsername) {
  return MsgPrivate.findMsgsBetweenByKeywords(keywords, sendingUsername, receivingUsername)
    .then((dbResult) => {
      if (dbResult.case === "legal") {
        return new HttpResponse("found private msgs between sender and receiver.", "PrivateMsgsFound", "false", dbResult.data);
      } else if (dbResult.case === "illegal") {
        return new HttpResponse("Only Stop Words.", "StopWordsOnly", "false", dbResult.data);
      }
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
}

async function updateToReadBetween(sendingUsername, receivingUsername) {
    const res = await MsgPrivate.updateToReadBetween(sendingUsername, receivingUsername)
    .then((dbResult) => {
        return new HttpResponse("updated unread private msgs to read.", "updateUnreadToRead", "false");
    })
    .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
    });
    return res;
}

module.exports = {
  sendPrivateMsg: sendPrivateMsg,
  findSendersWithUnreadMsgsByReceiver: findSendersWithUnreadMsgsByReceiver,
  findMsgsBetween: findMsgsBetween,
  updateToReadBetween: updateToReadBetween,
};
const SocketioService = require("../utils/socketio");
const MsgModel = require("../models/msgModel");
const HttpResponse = require("./httpResponse.js");
const Msg = require("../models/msgModel"); //check if works without it
const MsgPrivate = require("../models/msgPrivateModel");

async function sendMsg(content, username, status, isOnline, receivername) {

    // step01: store msg in db
    const resMsg = await MsgModel.create(content, username, status, isOnline, receivername)
    .then((dbResult) => {
        console.log("msg table updated row: " + dbResult.affectedRows);
        return new HttpResponse("Msg is created.", "msgCreated", "false", {"insertId": dbResult.insertId});
    })
    .catch((err) => {
       return new HttpResponse("db error.", "dbError", "true", err);
    });
    
    const insertId = resMsg.data.insertId;
    if (insertId == undefined) {
        return resMsg;
    }

    // step02: get the newly-created Msg from db (for its timestamp value)
    const msgForPush = await MsgModel.findMsg(insertId);
    
    // step03: push msg to online users 
    await SocketioService.getInstance().pushMsg(msgForPush);
  
    return resMsg;
}

async function getPublicMsgs(keywords) {
    console.log("getPublicMsgs");
    var resMsg;
    if (keywords) {
        resMsg = await findPublicMsgsByKeywordsHelper(keywords);
    } else {
        resMsg = await findPublicMsgsHelper();
    }
    return resMsg;
}

function findPublicMsgsByKeywordsHelper(keywords) {
    return MsgModel.findPublicMsgsByKeywords(keywords)
      .then((dbResult) => {
        if (dbResult.case === "legal") {
          return new HttpResponse("PublicMsg is queried.", "publicMsgQueried", "false", dbResult.data);
        } else if (dbResult.case === "illegal") {
          return new HttpResponse("Only Stop Words.", "StopWordsOnly", "false", dbResult.data);
        }
      })
      .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
      });
}

function findPublicMsgsHelper() {
  return MsgModel.findPublicMsgs()
    .then((dbResult) => {
      return new HttpResponse(
        "PublicMsg is queried.",
        "publicMsgQueried",
        "false",
        dbResult
      );
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
}

module.exports = {
    sendMsg: sendMsg,
    getPublicMsgs: getPublicMsgs
};

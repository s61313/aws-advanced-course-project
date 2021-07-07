const SocketioService = require("../utils/socketio");
const AnnouncementModel = require("../models/announcementModel");
const HttpResponse = require("./httpResponse.js");


async function sendAnnouncement(content, sendername) {

    // step01: store msg in db
    const resMsg = await AnnouncementModel.create(content, sendername)
        .then((dbResult) => {
            console.log("announcement table updated row: " + dbResult.affectedRows);
            return new HttpResponse("Announcement is created.", "announcementCreated", "false", { "insertId": dbResult.insertId });
        })

    const insertId = resMsg.data.insertId;
    // step02: get the newly-created Msg from db (for its timestamp value)
    const announcementForPush = await AnnouncementModel.findAnnouncement(insertId);

    // step03: push msg to online users 
    //await SocketioService.getInstance().pushAnnouncement(announcementForPush, "announcement notification");
    await SocketioService.getInstance().pushAnnouncement(announcementForPush, "announcement");

    return resMsg;
}

async function getAnnouncements(keywords) {
    var resMsg;
    if (keywords) {
        resMsg = await findAnnouncementsByKeywordsHelper(keywords);
        console.log(`searching by keyword ${keywords}`);
    } else {
        console.log('keyword is null');
        resMsg = await findAnnouncementsHelper();
    }
    return resMsg;
}


function findAnnouncementsByKeywordsHelper(keywords) {
    return AnnouncementModel.findAnnouncementsByKeywords(keywords)
        .then((dbResult) => {
            if (dbResult.case === "legal") {
                return new HttpResponse("Announcement is queried.", "announcementQueried", "false", dbResult.data);
            } else { 
                return new HttpResponse("Only Stop Words.", "StopWordsOnly", "false", dbResult.data); //else if (dbResult.case === "illegal")
            }
        })
}

function findAnnouncementsHelper() {
    return AnnouncementModel.findAnnouncements()
        .then((dbResult) => {
            return new HttpResponse(
                "Announcement is queried.",
                "announcementQueried",
                "false",
                dbResult
            );
        })
}

module.exports = {
    sendAnnouncement: sendAnnouncement,
    getAnnouncements: getAnnouncements
};

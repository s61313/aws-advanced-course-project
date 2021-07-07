const ActivityModel = require("../models/activityModel.js");
const HttpResponse = require("./httpResponse.js");

async function createActivity(organizer, activityName, activityTime, activityAddr, numOfPeopleNeeded, numOfHour) {

    // step01: store msg in db
    const resMsg = await ActivityModel.create(organizer, activityName, activityTime, activityAddr, numOfPeopleNeeded, numOfHour)
        .then((dbResult) => {
            console.log("activity table updated row: " + dbResult.affectedRows);
            return new HttpResponse("Activity is created.", "activityCreated", "false", { "insertId": dbResult.insertId });
        })

    const insertId = resMsg.data.insertId;
    const activityCreated = await ActivityModel.findActivityById(insertId);
    resMsg.data = activityCreated;

    return resMsg;
}

async function updateActivity(activityid, activityStatus) {

  // step01: store msg in db
  const resMsg = await ActivityModel.update(activityid, activityStatus)
      .then((dbResult) => {
          console.log("activity table updated row: " + dbResult.affectedRows);
          return new HttpResponse("Activity is updated.", "activityUpdated", "false");
      })

  // step02: get the newly-updated Activity from db  
  const activityCreated = await ActivityModel.findActivityById(activityid);
  resMsg.data = activityCreated;

  return resMsg;
}

async function getActivities(username) {
  var resDB = await ActivityModel.findActivityByOrganizer(username);
  var resMsg = new HttpResponse("Find Activity I Created", "FindActivityICreated", "false", resDB);
  return resMsg;  
}

async function getActivityById(activityId) {
  var resDB = await ActivityModel.findActivityById(activityId);
  var resMsg = new HttpResponse("Find Activity By Id", "FindActivityById", "false", resDB);  
  return resMsg;
}


async function getActivityToJoin(usernameToJoin) {
  var resDBToJoin = await ActivityModel.findActivityToJoin(usernameToJoin);
  var resDBJoined = await ActivityModel.findActivityJoined(usernameToJoin);
  var resDB = ActivityModel.findActivitNotYetJoined(resDBToJoin, resDBJoined);

  var resMsg = new HttpResponse("Find Activity to Join", "FindActivityToJoin", "false", resDB);  
  return resMsg;
}

async function joinActivity(activityId, usernameToJoin) {
  var resDB = await ActivityModel.join(activityId, usernameToJoin);
  var resMsg = new HttpResponse("Joined Activity", "activityJoined", "false", resDB);
  return resMsg;
}

async function unjoinActivity(activityId, usernameToJoin) {
  var resDB = await ActivityModel.unjoin(activityId, usernameToJoin);
  var resMsg = new HttpResponse("Unjoined Activity", "activityUnjoined", "false", resDB);
  return resMsg;
}


async function getActivityJoined(username) {
  var resDB = await ActivityModel.findActivityJoined(username);
  var resMsg = new HttpResponse("Found Joined Activity", "activityJoinedFound", "false", resDB);
  return resMsg;
}


module.exports = {
  createActivity: createActivity,
  getActivities: getActivities,
  getActivityById: getActivityById,
  updateActivity: updateActivity,
  getActivityToJoin: getActivityToJoin,
  joinActivity: joinActivity,
  getActivityJoined: getActivityJoined,
  unjoinActivity: unjoinActivity
};

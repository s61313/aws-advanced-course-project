const mydb = require("../utils/database.js");
class Activity {

  static create(
    organizer,
    activityName,
    activityTime,
    activityAddr,
    numOfPeopleNeeded,
    numOfHour
  ) {
    return new Promise((resolve, reject) => {
      const sql_create_msg =
        `INSERT INTO activity (organizer, activityName, activityTime, activityAddr, numOfPeopleNeeded, numOfHour) VALUES ?`;
      mydb
        .getConnection()
        .awaitQuery(sql_create_msg, [[[organizer, activityName, activityTime, activityAddr, numOfPeopleNeeded, numOfHour]]])
        .then((result) => {
          resolve(result);
        })
    });
  }

  static update(
    activityId,
    activityStatus
  ) {
    return new Promise((resolve, reject) => {
      const sql_update_msg =
        `UPDATE activity 
        SET activityStatus = ?
        WHERE activityid = ?`;

      mydb
        .getConnection()
        .awaitQuery(sql_update_msg, [activityStatus, activityId])
        .then((result) => {
          resolve(result);
        })
    });
  }  

  static findActivityById(id) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = `SELECT * FROM activity WHERE activityid = ?`;
      const values = [[id]];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, [values])
        .then((result) => {
          resolve(result);
        })
    });
  }

  static findActivityByOrganizer(organizer) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = `SELECT * FROM activity WHERE organizer = ? ORDER BY ts DESC`;
      const values = [[organizer]];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, [values])
        .then((result) => {
          resolve(result);
        })
    });
  }


  static findActivityToJoin(usernameToJoin) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = `SELECT * FROM activity WHERE activityStatus = "WAITING" AND organizer != ? ORDER BY ts DESC`;
      const values = [[usernameToJoin]];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, [values])
        .then((result) => {
          resolve(result);
        })
    });
  }


  static unjoin(activityId, username) {
    const sql1 = Activity.removeUserToActivity(activityId, username);
    const sql2 = Activity.decreaseRegisterNumber(activityId);
    return Promise.all([sql1, sql2]);
  }  

  static decreaseRegisterNumber(activityId) {
    return new Promise((resolve, reject) => {
      const sql_update_msg =
        `UPDATE activity SET numOfPeopleRegistered = numOfPeopleRegistered - 1 WHERE activityid = ?`;
      mydb
        .getConnection()
        .awaitQuery(sql_update_msg, [[[activityId]]])
        .then((result) => {
          resolve(result);
        })
    });    
  }  

  static removeUserToActivity(activityId, username) {
    return new Promise((resolve, reject) => {
      const sql_delete_msg =
        `DELETE FROM activityuser WHERE activityid = ? && username = ?`;
      mydb
        .getConnection()
        .awaitQuery(sql_delete_msg, [activityId, username])
        .then((result) => {
          resolve(result);
        })
    });    
  }  

  static join(activityId, username) {
    const sql1 = Activity.addUserToActivity(activityId, username);
    const sql2 = Activity.increaseRegisterNumber(activityId);
    return Promise.all([sql1, sql2]);
  }

  static increaseRegisterNumber(activityId) {
    return new Promise((resolve, reject) => {
      const sql_update_msg =
        `UPDATE activity SET numOfPeopleRegistered = numOfPeopleRegistered + 1 WHERE activityid = ?;`;
      mydb
        .getConnection()
        .awaitQuery(sql_update_msg, [[[activityId]]])
        .then((result) => {
          resolve(result);
        })
    });    
  }
  
  static addUserToActivity(activityId, username) {
    return new Promise((resolve, reject) => {
      const sql_create_msg =
        `INSERT INTO activityuser (activityid, username) VALUES ?`;
      mydb
        .getConnection()
        .awaitQuery(sql_create_msg, [[[activityId, username]]])
        .then((result) => {
          resolve(result);
        })
    });    
  }



  static findActivityJoined(username) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = 
        `
        SELECT * FROM activity a 
        INNER JOIN activityuser au ON a.activityid = au.activityid
        WHERE au.username = ?
        ORDER BY a.ts DESC;
        `;

      const values = [[username]];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, [values])
        .then((result) => {
          resolve(result);
        })
    });
  }  

  static findActivitNotYetJoined(resDBToJoin, resDBJoined) {
    var activityToJoin = [];
    for (var i = 0; i < resDBToJoin.length ;i++) {
      var isJoinedAlready = false;
      const actToJoin = resDBToJoin[i];
      for (var j = 0; j < resDBJoined.length ;j++) {
        const actJoined = resDBJoined[j];
        if (parseInt(actToJoin.activityid) === parseInt(actJoined.activityid)) {
          isJoinedAlready = true;
        }
      }
  
      if (isJoinedAlready === false) {
        activityToJoin.push(actToJoin);
      }
    }
  
    return activityToJoin;
  }

}

module.exports = Activity;

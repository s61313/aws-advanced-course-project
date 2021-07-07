const mydb = require('../utils/database.js');

class Status {
  static setNewStatus(username, status) {
    const sql1 = new Promise((resolve, reject) => {
      const sql_set_status = "INSERT INTO status(username, status) VALUES ?";
      //
      const values = [[username, status]];
      mydb
        .getConnection()
        .awaitQuery(sql_set_status, [values])
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {
          reject(err);
        });
    });

    const sql2 = new Promise((resolve, reject) => {
      const sql_set_status = "UPDATE user SET status = ? WHERE username = ?";
      mydb
        .getConnection()
        .awaitQuery(sql_set_status, [status, username])
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {
          reject(err);
        });
    });

    return Promise.all([sql1, sql2]);
  }

  static getStatusHistoryByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql_check_user =
        "SELECT * FROM status WHERE username = ? ORDER BY ts DESC";
      mydb
        .getConnection()
        .awaitQuery(sql_check_user, username)
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}




module.exports = Status;
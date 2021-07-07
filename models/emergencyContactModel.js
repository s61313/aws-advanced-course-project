const mydb = require("../utils/database.js");

class Em {
  constructor(username, phonenumber, address, emergencycontact) {
    this.username = username;
    this.phonenumber = phonenumber;
    this.address = address;
    this.emergencycontact = emergencycontact;
  }

  static create(
    username,
    phonenumber,
    address,
    emergencycontact,
  ) {
    const sql1 = new Promise((resolve, reject) => {
      const sql_set_ec = "INSERT INTO emergencycontact (username, phonenumber, address, emergencycontact) VALUES ?";
      mydb
        .getConnection()
        .awaitQuery(sql_set_ec, [[[username, phonenumber, address, emergencycontact]]])
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {
          reject(err);
        });
    });

    const sql2 = new Promise((resolve, reject) => {
      const sql_set_ec = "UPDATE emergencycontact SET phonenumber = ?, address = ?, emergencycontact = ?, emergencycontactstatus = 0 WHERE username = ?";
      mydb
        .getConnection()
        .awaitQuery(sql_set_ec, [phonenumber, address, emergencycontact,username])
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {
          reject(err);
        });
    });

    return Promise.all([sql1, sql2]);

  }


  static accept(requestusername, username) {
    return new Promise((resolve, reject) => {
      const sql_query_em = "UPDATE emergencycontact SET emergencycontactstatus = 1 WHERE username = ? AND emergencycontact = ? ";
      mydb
        .getConnection()
        .awaitQuery(sql_query_em, [requestusername, username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }

  static alert(username) {
    return new Promise((resolve, reject) => {
      const sql_query_em = "UPDATE emergencycontact SET emergencycontactstatus = 2 WHERE username = ?";
      mydb
        .getConnection()
        .awaitQuery(sql_query_em, [username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }

  static deny(requestusername, username) {
    return new Promise((resolve, reject) => {
      const sql_query_em = "UPDATE emergencycontact SET emergencycontactstatus = 3 WHERE username = ? AND emergencycontact = ? ";
      mydb
        .getConnection()
        .awaitQuery(sql_query_em, [requestusername, username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }

  static acknowledge(requestusername, username) {
    return new Promise((resolve, reject) => {
      const sql_query_em = "UPDATE emergencycontact SET emergencycontactstatus = 4 WHERE username = ? AND emergencycontact = ? ";
      mydb
        .getConnection()
        .awaitQuery(sql_query_em, [requestusername, username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }

  static findEmergencyContactByUsername(username) {
    return new Promise((resolve, reject) => {
      const sql_query_em = "SELECT * FROM emergencycontact WHERE username = ? ORDER BY ecid DESC LIMIT 1";
      mydb
        .getConnection()
        .awaitQuery(sql_query_em, [username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }


  static getButtonStatus(username) {
    return new Promise((resolve, reject) => {
      const sql_query_em = "SELECT * FROM emergencycontact WHERE username = ? ORDER BY ecid DESC LIMIT 1";
      mydb
        .getConnection()
        .awaitQuery(sql_query_em, [username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });

  }


  static findUserWithPendingEMRequest(username) {
    // aggregate by <sender, count_unread>

    return new Promise((resolve, reject) => {
      const sql_query_msg = "SELECT * FROM emergencycontact WHERE emergencycontact = ? AND (emergencycontactstatus = 0 OR emergencycontactstatus = 2)";
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, [username])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

}





module.exports = Em;
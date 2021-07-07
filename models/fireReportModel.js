const mydb = require("../utils/database.js");

class FireReport {
  constructor(
    reporterUsername,
    fireReportLocation,
    fireReportStatus,
    adminCheck,
    citizenCheck
  ) {
    this.reporterUsername = reporterUsername;
    this.fireReportLocation = fireReportLocation;
    this.fireReportStatus = fireReportStatus;
    this.adminCheck = adminCheck;
    this.citizenCheck = citizenCheck;
  }

  static create(reporterUsername, fireReportLocation) {
    return new Promise((resolve, reject) => {
      const fireReportStatus = "pending";
      const adminCheck = "unchecked";
      const citizenCheck = "checked";

      const sql_create_firereport =
        "INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck) VALUES ?";
      mydb
        .getConnection()
        .awaitQuery(sql_create_firereport, [
          [
            [
              reporterUsername,
              fireReportLocation,
              fireReportStatus,
              adminCheck,
              citizenCheck,
            ],
          ],
        ])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {});
    });
  }

  static getFireReports(fireReportStatus, reporterUsername) {
    return new Promise((resolve, reject) => {
      const sql_query_firereports = this.getFireReportsSQL(
        fireReportStatus,
        reporterUsername
      );
      mydb
        .getConnection()
        .awaitQuery(sql_query_firereports)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {});
    });
  }

  static getFireReportById(fireReportId) {
    return new Promise((resolve, reject) => {
      const sql_query_firereport =
        "SELECT * FROM firereport WHERE fireReportId = ?";
      mydb
        .getConnection()
        .awaitQuery(sql_query_firereport, fireReportId)
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {});
    });
  }

  static updateFireReportFireStatusById(
    fireReportId,
    fireReportStatus,
    adminCheck,
    citizenCheck
  ) {
    return new Promise((resolve, reject) => {
      const sql_update_firereport = this.getUpdateFireReportSQL(
        fireReportId,
        fireReportStatus,
        adminCheck,
        citizenCheck
      );
      mydb
        .getConnection()
        .awaitQuery(sql_update_firereport)
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {});
    });
  }

  static getFireReportsSQL(fireReportStatus, reporterUsername) {
    var sql_query_firereports;
    if (fireReportStatus && reporterUsername === undefined) {
      sql_query_firereports = `SELECT * FROM firereport WHERE fireReportStatus = "${fireReportStatus}" ORDER BY fireReportTime DESC`;
    } else if (fireReportStatus === undefined && reporterUsername) {
      sql_query_firereports = `SELECT * FROM firereport WHERE reporterUsername = "${reporterUsername}" ORDER BY fireReportTime DESC`;
    } else if (fireReportStatus && reporterUsername) {
      sql_query_firereports = `SELECT * FROM firereport WHERE reporterUsername = "${reporterUsername}" AND fireReportStatus = "${fireReportStatus}" ORDER BY fireReportTime DESC`;
    } else {
      sql_query_firereports = `SELECT * FROM firereport ORDER BY fireReportTime DESC`;
    }
    return sql_query_firereports;
  }

  static getUpdateFireReportSQL(
    fireReportId,
    fireReportStatus,
    adminCheck,
    citizenCheck
  ) {
    var sql_update_firereport;
    if (fireReportStatus) {
      sql_update_firereport = `UPDATE firereport SET fireReportStatus = "${fireReportStatus}", citizenCheck = "unchecked" WHERE fireReportId = ${fireReportId}`;
    } else if (adminCheck) {
      sql_update_firereport = `UPDATE firereport SET adminCheck = "${adminCheck}" WHERE fireReportId = ${fireReportId}`;
    } else if (citizenCheck) {
      sql_update_firereport = `UPDATE firereport SET citizenCheck = "${citizenCheck}" WHERE fireReportId = ${fireReportId}`;
    }
    return sql_update_firereport;
  }

  static getReporterUsernameByFireReportId(fireReportId) {
    return new Promise((resolve, reject) => {
      const sql_query_firereport = `SELECT reporterUsername FROM firereport WHERE fireReportId = "${fireReportId}"`;
      mydb
        .getConnection()
        .awaitQuery(sql_query_firereport)
        .then((dbResp) => {
          resolve(dbResp);
        })
        .catch((err) => {});
    });
  }

  static getFireReportLocationByFireReportId(fireReportId) {
    return new Promise((resolve, reject) => {
      const sql_query_firereport = `SELECT fireReportLocation FROM firereport WHERE fireReportId = "${fireReportId}"`;
      mydb
        .getConnection()
        .awaitQuery(sql_query_firereport)
        .then((dbResp) => {
          resolve(dbResp[0]);
        })
        .catch((err) => {});
    });
  }
}
module.exports = FireReport;

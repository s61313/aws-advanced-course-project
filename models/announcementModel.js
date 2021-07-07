const mydb = require('../utils/database.js');
const stopWords = require("../utils/stopWords.js").getStopWords();
class Announcement {

  constructor(content, sendername,) {
    this.content = content;
    this.sendername = sendername;

  }

  static create(content, sendername) {

    return new Promise((resolve, reject) => {
      const sql_create_announcement = "INSERT INTO announcement (content, sendername) VALUES ?";
      mydb.getConnection().awaitQuery(sql_create_announcement, [[[content, sendername]]])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAnnouncement(announcementid) {
    return new Promise((resolve, reject) => {
      const sql_query_announcement = "SELECT * FROM announcement WHERE announcementid = ?";
      const values = [
        [announcementid]
      ];
      mydb.getConnection().awaitQuery(sql_query_announcement, [values])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAnnouncements() {
    return new Promise((resolve, reject) => {
      const sql_query_announcement = "SELECT * FROM announcement ORDER BY ts ASC";
      mydb.getConnection().awaitQuery(sql_query_announcement)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findAnnouncementsByKeywords(keywords) {
    return new Promise((resolve, reject) => {
      const keywordList = keywords.split(/\s+/);
      if (!this.checkNonStopWordExist(keywordList)) {
        resolve({ case: "illegal", data: [] });
      } else {
        const sql_query_announcement = this.generateAnnouncementsByKeywordsSQL(
          keywordList
        );
        mydb
          .getConnection()
          .awaitQuery(sql_query_announcement)
          .then((result) => {
            resolve({ case: "legal", data: result });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  static checkNonStopWordExist(keywordList) {
    var isNonStopWordExist = false;
    for (var i = 0; i < keywordList.length; ++i) {

      const keyword = keywordList[i].trim();
      if (keyword === "") {
        continue;
      }
      if (!stopWords.includes(keyword)) {
        isNonStopWordExist = true;
      }
    }
    return isNonStopWordExist;
  }

  static generateAnnouncementsByKeywordsSQL(keywordList) {
    var result = "SELECT * FROM announcement WHERE ";
    for (var i = 0; i < keywordList.length; ++i) {
      const keyword = keywordList[i].trim();
      if (stopWords.includes(keyword)) {
        continue;
      }
      result += `content LIKE "%${keywordList[i]}%" OR `;
    }
    result = result.substring(0, result.length - 3);
    result += " ORDER BY ts DESC";
    return result;
  }



}

module.exports = Announcement;
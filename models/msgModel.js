const mydb = require('../utils/database.js');

const stopWordsModal = require("../utils/stopWords.js");
class Msg {
  constructor(content, sendername, senderstatus, senderisonline, receivername) {
    this.content = content;
    this.sendername = sendername;
    this.senderstatus = senderstatus;
    this.senderisonline = senderisonline;
    this.receivername = receivername;
  }

  static create(
    content,
    sendername,
    senderstatus,
    senderisonline,
    receivername
  ) {
    var senderisonline = senderisonline == 1 ? "true" : "false";
    return new Promise((resolve, reject) => {
      const sql_create_msg =
        "INSERT INTO msg (content, sendername, senderstatus, senderisonline, receivername) VALUES ?";
      mydb
        .getConnection()
        .awaitQuery(sql_create_msg, [
          [[content, sendername, senderstatus, senderisonline, receivername]],
        ])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findMsg(msgid) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = "SELECT * FROM msg WHERE msgid = ?";
      const values = [[msgid]];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, [values])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findPublicMsgs() {
    return new Promise((resolve, reject) => {
      const sql_query_public_msg =
        "SELECT * FROM msg WHERE receivername IS NULL ORDER BY ts ASC";
      mydb
        .getConnection()
        .awaitQuery(sql_query_public_msg)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findPublicMsgsByKeywords(keywords) {
    return new Promise((resolve, reject) => {
      const keywordList = keywords.split(/\s+/);

      if (!stopWordsModal.checkNonStopWordExist(keywordList)) {
        resolve({ case: "illegal", data: [] });
      } else {
        const sql_query_public_msg = this.generatePublicMsgsByKeywordsSQL(
          keywordList
        );
        mydb
          .getConnection()
          .awaitQuery(sql_query_public_msg)
          .then((result) => {
            resolve({ case: "legal", data: result });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  static generatePublicMsgsByKeywordsSQL(keywordList) {
    var result = "SELECT * FROM msg WHERE ";
    for (var i = 0; i < keywordList.length; ++i) {
      const keyword = keywordList[i].trim();
      if (keyword === "") continue;
      if (stopWordsModal.getStopWords().includes(keyword)) {
        continue;
      }
      result += `content LIKE "%${keywordList[i]}%" OR `;
    }
    result = result.substring(0, result.length - 3);
    result += " ORDER BY ts DESC";
    return result;
  }
}

module.exports = Msg;
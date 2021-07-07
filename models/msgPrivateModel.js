const mydb = require("../utils/database.js");
const stopWordsModal = require("../utils/stopWords.js");
class Msg {
  constructor(content, sendername, senderstatus, receivername, receiverstatus) {
    this.content = content;
    this.sendername = sendername;
    this.senderstatus = senderstatus;
    this.receivername = receivername;
    this.receiverStatus = receiverStatus;
  }

  static create(
    content,
    senderName,
    senderStatus,
    receiverName,
    receiverStatus
  ) {
    return new Promise((resolve, reject) => {
      const sql_create_msg =
        "INSERT INTO privatemsg (content, senderName, senderStatus, receiverName, receiverStatus) VALUES ?";
      mydb
        .getConnection()
        .awaitQuery(sql_create_msg, [[[content, senderName, senderStatus, receiverName, receiverStatus]]])
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findMsgById(msgid) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = "SELECT * FROM privatemsg WHERE msgid = ?";
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

  static findMsgsBetween(sendingUsername, receivingUsername) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = "SELECT * FROM privateMsg WHERE (senderName = ? AND receiverName = ?) OR (senderName = ? AND receiverName = ?)";
      const values = [sendingUsername, receivingUsername, receivingUsername, sendingUsername];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, values)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static findMsgsBetweenByKeywords(keywords, username1, username2) {
    return new Promise((resolve, reject) => {
      const keywordList = keywords.split(/\s+/);

      if (!stopWordsModal.checkNonStopWordExist(keywordList)) {
        resolve({ case: "illegal", data: [] });
      } else {
        const sql_query_private_msg = this.generatePrivateMsgsByKeywordsSQL(
          keywordList, username1, username2
        );
        mydb
          .getConnection()
          .awaitQuery(sql_query_private_msg)
          .then((result) => {
            resolve({ case: "legal", data: result });
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  }

  static generatePrivateMsgsByKeywordsSQL(keywordList, username1, username2) {
    var result = `SELECT * FROM privatemsg `
    result += `WHERE ((senderName = "${username1}" AND receiverName = "${username2}") OR ( senderName = "${username2}" AND receiverName = "${username1}")) `;
    result += `AND (`;
    for (var i = 0; i < keywordList.length; ++i) {
      const keyword = keywordList[i].trim();
      if (keyword === "") continue;
      if (stopWordsModal.getStopWords().includes(keyword)) {
        continue;
      }
      result += `content LIKE "%${keywordList[i]}%" OR `;
    }
    result = result.substring(0, result.length - 3);
    result += `)`;
    result += " ORDER BY ts DESC";
    return result;
  }


  // find all messages to a receiver
  static findMsgsByReceiverUsername(username) {
    // aggregate by <sender, count_unread>
    return new Promise((resolve, reject) => {
      const sql_query_msg = "SELECT * FROM privatemsg WHERE receiverName = ?";
      const values = [[username]];
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

  // find all senders with unread message count to a receiver
  static findSendersWithUnreadMsgsByReceiver(username) {
    return new Promise(async (resolve, reject) => {
      const msgs = await this.findMsgsByReceiverUsername(username);
      var senderUnreadMsgsCount = new Map();
      for (var i = 0; i < msgs.length; ++i) {
        const senderName = msgs[i].senderName;
        if (!senderUnreadMsgsCount.has(senderName)) {
          senderUnreadMsgsCount.set(senderName, 0);
        }
        if (msgs[i].isRead === "unread") {
          senderUnreadMsgsCount.set(
            senderName,
            senderUnreadMsgsCount.get(senderName) + 1
          );
        }
      }
      const responses = Object.fromEntries(senderUnreadMsgsCount);
      var result = [];
      for (var res in responses)
        result.push({ username: res, count: responses[res] });
      resolve(result);
    });
  }

  static updateToReadBetween(sendingUsername, receivingUsername) {
    return new Promise((resolve, reject) => {
      const sql_query_msg = "UPDATE privatemsg SET isRead = 'read' WHERE isRead = 'unread' AND senderName = ? And receiverName = ?";
      const values = [sendingUsername, receivingUsername];
      mydb
        .getConnection()
        .awaitQuery(sql_query_msg, values)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }


}

module.exports = Msg;

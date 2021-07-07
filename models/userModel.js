const mydb = require('../utils/database.js');
const bcrypt = require("bcryptjs");
const stopWords = require("../utils/stopWords.js").getStopWords();


class User {
    static create(username, password) {
        return new Promise((resolve, reject) => {
            const saltRounds = 10;
            bcrypt.hash(password, saltRounds)
                .then((hashedPassword) => {
                    const sql_create_user = "INSERT INTO user (username, password, isonline) VALUES ?";
                    const values = [
                        [username, hashedPassword, 1]
                    ];
                    // mysql-await
                    const dbResp = mydb.getConnection().awaitQuery(sql_create_user, [values]);
                    return dbResp; // return a Promise, so it will wait 
                })
                .then((dbResp) => {
                    console.log("row inserted: " + dbResp.affectedRows);
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findUserByName(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT * FROM user WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findUserByNameWithoutPwd(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT userid, username, isonline FROM user WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static setUserOnline(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "UPDATE user SET isonline = true WHERE username = ?"
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static getAllUsersWithoutPwd() {
        return new Promise((resolve, reject) => {
            const sql_check_user = "SELECT userid, username, isonline, status FROM user WHERE isonline IS NOT NULL ORDER BY isonline DESC, username"
            mydb.getConnection().awaitQuery(sql_check_user)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }



    static setUserOffline(username) {
        return new Promise((resolve, reject) => {
            const sql_check_user = "UPDATE user SET isonline = false WHERE username = ?";
            mydb.getConnection().awaitQuery(sql_check_user, username)
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }



    //starting search user logic-------------------------------------
    
    //search user by status, display username
    static findUserByStatus(status){
        return new Promise((resolve, reject) => {
            
            //console.log(`status:   ${status}`);
            const sql_user_status = "SELECT username, isonline FROM user WHERE status = ? ORDER BY isonline DESC, username "
            const value = [[status]];
            mydb.getConnection().awaitQuery(sql_user_status, [value])
                .then((dbResp) => {
                    //console.log(`findUserByStatus: ${dbResp.data}`);
                    resolve({case: "legal", data: dbResp});
                })
                .catch((err) => {
                    reject(err);
                });
                
        });
    }
    //search user by username keywords, display username + status
    static findUserByNameKeywords(keywords) {
        return new Promise((resolve, reject) => {
            const keywordList = keywords.split(/\s+/);
            if (!this.checkNonStopWordExist(keywordList)) {
                resolve({ case: "illegal", data: [] });
            } else {
                const sql_query_username = this.generateUserByKeywordsSQL(
                    keywordList
                );
                mydb
                    .getConnection()
                    .awaitQuery(sql_query_username)
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

    static generateUserByKeywordsSQL(keywordList) {
        var result = "SELECT username, status, isonline FROM user WHERE ";
        for (var i = 0; i < keywordList.length; ++i) {
            const keyword = keywordList[i].trim();
            if (stopWords.includes(keyword)) {
                continue;
            }
            result += `username LIKE "%${keywordList[i]}%" OR `;
        }
        result = result.substring(0, result.length - 3);
        result += " ORDER BY isonline DESC, username";
        return result;
    }

    






}

module.exports = User;

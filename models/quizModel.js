const mydb = require('../utils/database.js');

class Quiz{
    
    static getScoreByName(username) {
        return new Promise((resolve, reject) => {
            const sql_score = `SELECT score FROM user WHERE username = ?`;
            mydb.getConnection().awaitQuery(sql_score, username)
                .then((dbResp) => {
                    // console.log("Model = " + dbResp);
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static findAllQuiz() {
        return new Promise((resolve, reject) => {
            const sql_score = `SELECT * FROM quiz`;
            mydb.getConnection().awaitQuery(sql_score)
                .then((dbResp) => {
                    // console.log("Model = " + dbResp);
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static getQuizRecordbyUser(username) {
        return new Promise((resolve, reject) => {
            const sql_get_record = `SELECT quiziddone FROM quizrecord WHERE username=?`;
            mydb.getConnection().awaitQuery(sql_get_record, username)
                .then((dbResp) => {
                    // console.log("Model = " + dbResp);
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static updateScore(username, score) {
        return new Promise((resolve, reject) => {
            const sql_score = `UPDATE user SET score = ? WHERE username = ?`;
            mydb.getConnection().awaitQuery(sql_score, [score, username])
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static insertQuiz(quiz_creation_info) {
        const {quiz, question1, q1option1, q1option2, answer1, question2, q2option1, q2option2, answer2, creator} = quiz_creation_info;
        return new Promise((resolve, reject) => {
            const sql_score = `INSERT quiz (quiz, question1, q1option1, q1option2, answer1, question2, q2option1, q2option2, answer2, creator) VALUES ?`;
            mydb.getConnection().awaitQuery(sql_score, [[[quiz, question1, q1option1, q1option2, answer1, question2, q2option1, q2option2, answer2, creator]]])
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    static insertRecord(username, idquiz) {

        return new Promise((resolve, reject) => {
            const sql_score = `INSERT quizrecord (username, quiziddone) VALUES ?`;
            mydb.getConnection().awaitQuery(sql_score, [[[username, idquiz]]])
                .then((dbResp) => {
                    resolve(dbResp);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    insertRecord
    
}
module.exports = Quiz;

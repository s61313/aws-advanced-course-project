const QuizModel = require('../models/quizModel');
const HttpResponse = require("./httpResponse.js");
const SocketioService = require("../utils/socketio");


async function getUserScore(username){

    if(!username)
    {
        return new HttpResponse(
            "Get User's quiz score fail: username is empty",
            "ErrorgetScoreByName",
            "true"
        );
    }

    const res = await QuizModel.getScoreByName(username)
        .then((dbResult) => {
            console.log("Get user's score: " + dbResult[0].score);
            return new HttpResponse(
                "Get User's quiz score",
                "getScoreByName",
                "false",
                dbResult[0].score
            );
        })
        .catch((err) => {
            return new HttpResponse("db error.", "dbError", "true", err);
        });
    return res;
}

async function getQuizList(){

    const res = await QuizModel.findAllQuiz()
        .then((dbResult) => {
            console.log("Get All Quiz List from database");

            return new HttpResponse(
                "Get quiz list",
                "getQuizList",
                "false",
                dbResult
            );
        })
        .catch((err) => {
            return new HttpResponse("db error.", "dbError", "true", err);
        });
    return res;
}

async function getQuizRecord(username){

    const res = await QuizModel.getQuizRecordbyUser(username)
        .then((dbResult) => {
            console.log("Get Quiz Record from database");
            return new HttpResponse(
                "Get quiz record",
                "getQuizRecord",
                "false",
                dbResult
            );
        })
        .catch((err) => {
            return new HttpResponse("db error.", "dbError", "true", err);
        });
    return res;
}

async function updateUserScore(username, score){

    const cmu_score = await QuizModel.getScoreByName(username);
    const new_score = parseInt(cmu_score[0].score, 10) + parseInt(score, 10); // compute the new score
    const res = await QuizModel.updateScore(username, new_score)
        .then((dbResult) => {
            console.log("Update user new score to database");
            return new HttpResponse(
                "Update user score",
                "updateUserScore",
                "false",
                new_score
            );
        })
        .catch((err) => {
            return new HttpResponse("db error.", "dbError", "true", err);
        });
    return res;
}

async function insertQuizRecord(username, idquiz){

    const res = await QuizModel.insertRecord(username, idquiz)
        .then((dbResult) => {
            console.log("Insert quiz record to database");
            return new HttpResponse(
                "Insert quiz record",
                "insertQuizRecord",
                "false",
                dbResult
            );
        })
        .catch((err) => {
            return new HttpResponse("db error.", "dbError", "true", err);
        });
    return res;
}

async function createNewQuiz(quiz_creation_info) {
    const res = await QuizModel.insertQuiz(quiz_creation_info)
    .then((dbResult) => {
        console.log("Insert new Quiz to database");
            return new HttpResponse(
                "Insert new Quiz",
                "createNewQuiz",
                "false",
                dbResult
            );
    })
    .catch((err) => {
        return new HttpResponse("db error.", "dbError", "true", err);
    });
    return res;
}

module.exports = {
    getUserScore: getUserScore,
    getQuizList: getQuizList,
    updateUserScore: updateUserScore,
    createNewQuiz: createNewQuiz,
    getQuizRecord: getQuizRecord,
    insertQuizRecord: insertQuizRecord,
};
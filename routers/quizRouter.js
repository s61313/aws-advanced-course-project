const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const registerController = require("../controllers/registerController");
const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.use(registerController.verifyJwtToken) // jwt validation middle ware 

router.get("/quiz", async function (req, res) {
    var resMsg;
    resMsg = await quizController.getUserScore(req.query.username);
    res.send(resMsg);
});

router.post("/quiz", async function (req, res) {
    var resMsg;
    resMsg = await quizController.updateUserScore(req.body.username, req.body.score);
    await quizController.insertQuizRecord(req.body.username, req.body.idquiz);
    res.send(resMsg);
});
  
router.get("/quiz/list", async function (req, res) {
    var resMsg;
    resMsg = await quizController.getQuizList();
    res.send(resMsg);
});

router.get("/quiz/record", async function (req, res) {
    var resMsg;
    resMsg = await quizController.getQuizRecord(req.query.username);
    res.send(resMsg);
});

router.post("/quiz/creation", async function (req, res) {
    var resMsg;
    resMsg = await quizController.createNewQuiz(req.body);
    res.send(resMsg);
});


module.exports = router;

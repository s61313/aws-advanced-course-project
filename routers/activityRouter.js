const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(require("../controllers/registerController.js").verifyJwtToken) // jwt validation middle ware 


router.get("/activity/waiting", async function (req, res) {
    console.log('get req.query.usernameToJoin: ' + req.query.usernameToJoin);
    const resMsg = await activityController.getActivityToJoin(req.query.usernameToJoin);
    res.send(resMsg);
});

router.post("/activity/join/:id", async function (req, res) {
    console.log('post join activity');
    const resMsg = await activityController.joinActivity(req.params.id, req.query.username);
    res.send(resMsg);
});

router.post("/activity/unjoin/:id", async function (req, res) {
    console.log('post unjoin activity');
    const resMsg = await activityController.unjoinActivity(req.params.id, req.query.username);
    res.send(resMsg);
});

router.get("/activity/joined", async function (req, res) {
    console.log('joined get req.query.username: ' + req.query.username);
    const resMsg = await activityController.getActivityJoined(req.query.username);
    res.send(resMsg);
});


router.get("/activity/:id", async function (req, res) {
    console.log('get req.params.id: ' + req.params.id);
    const resMsg = await activityController.getActivityById(req.params.id);
    res.send(resMsg);
});

router.get("/activity", async function (req, res) {
    console.log('get req.query.username: ' + req.query.username);
    const resMsg = await activityController.getActivities(req.query.username);
    res.send(resMsg);
});


router.post("/activity", async function (req, res) {
    console.log('post activity');
    const resMsg = await activityController.createActivity(req.body.organizer, req.body.activityName, req.body.activityTime, req.body.activityAddr, req.body.numOfPeopleNeeded, req.body.numOfHour);
    res.send(resMsg);
});

router.put("/activity/:id", async function (req, res) {
    console.log('post activity');
    const resMsg = await activityController.updateActivity(req.params.id, req.body.status);
    res.send(resMsg);
});


module.exports = router;
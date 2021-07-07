const express = require("express");
const router = express.Router();
const announcementController = require("../controllers/announcementController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(require("../controllers/registerController.js").verifyJwtToken) // jwt validation middle ware 
router.get("/announcement", async function (req, res) {
    console.log('get req.query.keywords: ' + req.query.keywords);
    const resMsg = await announcementController.getAnnouncements(req.query.keywords);
    res.send(resMsg);
});
router.post("/announcement", async function (req, res) {
    console.log('psot announcement');
    const resMsg = await announcementController.sendAnnouncement( req.body.content, req.body.username);
    res.send(resMsg);
});

module.exports = router;
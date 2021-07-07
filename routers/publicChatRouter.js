const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(require("../controllers/registerController.js").verifyJwtToken) // jwt validation middle ware 
router.get("/messages/public", async function (req, res) {
    const resMsg = await chatController.getPublicMsgs(req.query.keywords);
    res.send(resMsg);
});


router.post("/messages/public", async function (req, res) {
    const resMsg = await chatController.sendMsg( req.body.content, req.body.username, req.body.status, req.body.isOnline );
    res.send(resMsg);
});
module.exports = router;
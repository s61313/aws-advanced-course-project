const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const privateChatController = require("../controllers/privateChatController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(registerController.verifyJwtToken) // jwt validation middle ware 


router.post("/messages/private", async function (req, res) {
    const resMsg = await privateChatController.sendPrivateMsg( req.body.content, req.body.sendingUsername, req.body.senderStatus, req.body.receivingUsername, req.body.receiverStatus );
    res.send(resMsg);
});
router.get("/users/:username/private", async function (req, res) {
    const resMsg = await privateChatController.findSendersWithUnreadMsgsByReceiver(req.params.username);
    res.send(resMsg);
});
router.get("/messages/private/:sendingUsername/:receivingUsername", async function (req, res) {
        const resMsg = await privateChatController.findMsgsBetween(req.query.keywords, req.params.sendingUsername, req.params.receivingUsername);
        res.send(resMsg);
    }
);
router.put("/messages/private/:sendingUsername/:receivingUsername", async function (req, res) {
        const resMsg = await privateChatController.updateToReadBetween( req.params.sendingUsername, req.params.receivingUsername );
        res.send(resMsg);
    }
);
module.exports = router;
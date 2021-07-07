const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const chatController = require("../controllers/chatController.js");
const privateChatController = require("../controllers/privateChatController.js");
const HttpResponse = require("../controllers/httpResponse.js");
const cookieParser = require("cookie-parser");
const statusController = require('../controllers/statusController.js');

router.use(cookieParser());

router.post("/users", async function (req, res) {
  const { username, password } = req.body;
  const resMsg = await registerController.createUser(username, password);
  res.cookie("token", resMsg.data.token, { maxAge: 900000, httpOnly: true });
  res.send(resMsg);
});

router.put("/users/:username/online", async function (req, res) {
  const { password } = req.body;
  const { username } = req.params;
  const resMsg = await registerController.login(username, password);
  if (resMsg.data !== undefined) {
    res.cookie("token", resMsg.data.token, { maxAge: 900000, httpOnly: true });
  }
  res.send(resMsg);
});


router.get("/users", async function (req, res) {
  const { username } = req.query;
  var resMsg;
  if (username) {
    resMsg = await registerController.findUserByNameWithoutPwd(username);
  } else {
    resMsg = await registerController.getAllUsersWithoutPwd();
  }
  res.send(resMsg);
});

router.get("/users/:username", async function (req, res) {
  const { username } = req.params;
  var resMsg = await registerController.findUserByNameWithoutPwd(username);
  res.send(resMsg);
});



router.use(registerController.verifyJwtToken) // jwt validation middle ware 

router.post("/users/:username/status", async function (req, res) {
  const {username, status} = req.body;
  const resMsg = await statusController.setStatus(username, status);
  res.send(resMsg);
});
/** User RESTful API zone **/
// /users/:username/offline
router.put("/users/:username/offline", async function (req, res) {
  const { username } = req.params;
  const token = req.headers.authorization;
  var resMsg = await registerController.logout(username, token);
  res.clearCookie("token");
  res.send(resMsg);
});


/** User RESTful API zone **/

/** Chat RESTful API zone */

// // /messages/public
// router.get("/messages/public", async function (req, res) {
//   const resMsg = await chatController.getPublicMsgs();
//   res.send(resMsg);
// });

// router.post("/messages/public", async function (req, res) {
//   const { username, content, status, isOnline } = req.body; // ??? isOnline and status shouldn't be decided by front-end request ??? timestamp should also be provided by servers
//   const resMsg = await chatController.sendMsg(
//     content,
//     username,
//     status,
//     isOnline
//   );
//   res.send(resMsg);
// });

// router.post("/messages/private", async function (req, res) {
//   const {
//     sendingUsername,
//     senderStatus,
//     receivingUsername,
//     receiverStatus,
//     content,
//   } = req.body;
//   const resMsg = await privateChatController.sendPrivateMsg(
//     content,
//     sendingUsername,
//     senderStatus,
//     receivingUsername,
//     receiverStatus
//   );
//   res.send(resMsg);
// });

// router.get("/users/:username/private", async function (req, res) {
//   const { username } = req.params;
//   const resMsg = await privateChatController.findSendersWithUnreadMsgsByReceiver(
//     username
//   );
//   res.send(resMsg);
// });

// router.get(
//   "/messages/private/:sendingUsername/:receivingUsername",
//   async function (req, res) {
//     const { sendingUsername, receivingUsername } = req.params;
//     const resMsg = await privateChatController.findMsgsBetween(
//       sendingUsername, receivingUsername
//     );
//     res.send(resMsg);
//   }
// );

// router.put(
//   "/messages/private/:sendingUsername/:receivingUsername",
//   async function (req, res) {
//     const { sendingUsername, receivingUsername } = req.params;
//     const resMsg = await privateChatController.updateToReadBetween(
//       sendingUsername,
//       receivingUsername
//     );
//     res.send(resMsg);
//   }
// );
/** Chat RESTful API zone */

module.exports = router;

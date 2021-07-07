const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const emergencyContactController = require("../controllers/emergencyContactController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(registerController.verifyJwtToken) // jwt validation middle ware 



router.post("/emergency/contact", async function (req, res) {
    const resMsg = await emergencyContactController.setEmergencyContact( req.body.Username, req.body.Phonenumber, req.body.Address, req.body.EmergencyContact);
    res.send(resMsg);
});

router.get("/emergency/contact/:username/", async function (req, res) {
    const resMsg = await emergencyContactController.findIfUserHasPendingRequest(req.params.username);
    res.send(resMsg);
});

router.put("/emergency/contact/accept/", async function (req, res) {
    const resMsg = await emergencyContactController.acceptEmergencyContactRequest(req.body.requestusername,req.body.username);
    res.send(resMsg);
});

router.put("/emergency/contact/decline/", async function (req, res) {
    const resMsg = await emergencyContactController.declineEmergencyContactRequest(req.body.requestusername,req.body.username);
    res.send(resMsg);
});

router.put("/emergency/contact/acknowledge/", async function (req, res) {
    const resMsg = await emergencyContactController.acknowledgeEmergencyContactAlert(req.body.requestusername,req.body.username);
    res.send(resMsg);
});

router.put("/emergency/contact/alert/", async function (req, res) {
    const resMsg = await emergencyContactController.alert(req.body.username);
    res.send(resMsg);
});

router.get("/emergency/alert/:username", async function (req, res) {
    const resMsg = await emergencyContactController.getButtonStatus(req.params.username);
    res.send(resMsg);
});





module.exports = router;
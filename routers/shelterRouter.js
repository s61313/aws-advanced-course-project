const express = require("express");
const router = express.Router();
const shelterController = require("../controllers/shelterController.js");
const cookieParser = require("cookie-parser");
router.use(cookieParser());
router.use(require("../controllers/registerController.js").verifyJwtToken) // jwt validation middle ware 

//TODO: fix the parameters of shelterController functions

router.get("/shelters/search", async function (req, res) {
    console.log('get req.query.partySize: ' + req.query.partySize + ' get req.query.petAccom: ' + req.query.petAccom + ' get req.query.disAccom: ' + req.query.disAccom);
    const resMsg = await shelterController.getShelters(req.query.partySize, req.query.petAccom, req.query.disAccom);
    res.send(resMsg);
    //remember that resMsg is of format {string, string, db.data}, so only db.data is useful
});

router.post("/shelters", async function (req, res) {
    console.log('created entry');
    const resMsg = await shelterController.createShelter(req.body.providername, req.body.address, req.body.residenceType, req.body.occupancy, req.body.petFriendly, req.body.disFriendly);
    res.send(resMsg);
});

router.get("/shelters", async function (req, res) {
    console.log('got own entry');
    const resMsg = await shelterController.getOwnShelter(req.query.providername);
    res.send(resMsg);
});

router.delete("/shelters", async function (req, res) {
    var providername = req.body.providername;
    console.log(`deleted own entry ${providername}`);
    const resMsg = await shelterController.deleteOwnShelter(providername);
    res.send(resMsg);
});

module.exports = router;
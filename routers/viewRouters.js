const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerController.js");
const cookieParser = require("cookie-parser");

router.use(cookieParser());

router.get("/", (req, res) => {
  res.render("homepage");
});

router.get("/joincommunity", (req, res) => {
  res.render("registration");
});

router.get("/welcome", (req, res) => {
  res.render("welcome");
});

router.get("/activity", (req, res) => {
  res.render("activity");
});


router.use(registerController.verifyJwtToken); // jwt validation middle ware

router.get("/status", (req, res) => {
  res.render("status");
});

router.get("/cloudwatch", (req, res) => {
  res.render("cloudwatch");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});


router.get("/announcement", (req, res) => {
  res.render("announcement");
})

router.get("/chatroom", (req, res) => {
  res.render("chatroom");
});

router.get("/privateChatroom", (req, res) => {
  res.render("privateChatroom");
});

router.get("/privateMsgs", (req, res) => {
  res.render("privateMsgs");
});

router.get("/status", (req, res) => {
  res.render("status");
});

router.get("/quiz", (req, res) => {
  res.render("quiz");
});

/*I4-ANDY******************/

router.get("/shelters", (req, res) => {
  res.render("shelter");
})

router.get("/shelters/creation", (req, res) => {
  res.render("shelterCreate");
})

router.get("/shelters/creation/confirmation", (req, res) => {
  res.render("shelterConfirmation");
})

router.get("/shelters/creation/entries", (req, res) => {
  res.render("shelterMyEntry");
})


router.get("/shelters/search", (req, res) => {
  res.render("shelterFind");
})

router.get("/shelters/search/compatibleShelters", (req, res) => {
  res.render("shelterResults");
})

/********************** */
router.get("/fireReportMap", (req, res) => {
  res.render("fireReportMap");
});

router.get("/unresolvedFireReports", (req, res) => {
  res.render("unresolvedFireReports");
});

router.get("/emergencyContact", (req, res) => {
  res.render("emergencyContact");
})

router.get("/emergencyRequest", (req, res) => {
  res.render("emergencyRequest");
})
module.exports = router;
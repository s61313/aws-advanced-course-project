// entry point of whole app
//Require modules
const express = require("express");
const db = require('./utils/database');
const path = require("path");
const moment = require("moment");
const expressLayouts = require("express-ejs-layouts");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");
const main_router = require("./routers/userRouter");
const app = express();
const SocketioService = require("./utils/socketio");
const cors = require('cors');
app.use(cors());

//Set up EJS
//app.use(expressLayouts);
app.set("views", path.join(__dirname, "./views"));
app.engine(".html", require("ejs").__express);
app.set("view engine", "ejs");

//Establish static folder
const publicDirectoryPath = path.join(__dirname, "public");
app.use(express.static(publicDirectoryPath));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Establish router
//app.use("/", main_router); /*replace index with name of router,js*/
app.use("/api", require("./routers/cloudwatchRouter.js"));
app.use("/api", require("./routers/registrationRouter.js"));
app.use("/api", require("./routers/userRouter.js"));
app.use("/api", require("./routers/publicChatRouter.js"));
app.use("/api", require("./routers/privateChatRouter.js"));
app.use("/api", require("./routers/announcementRouter.js"));
app.use("/api", require("./routers/statusRouter.js"));
app.use("/api", require("./routers/activityRouter.js"));
app.use("/api", require("./routers/quizRouter.js"));
app.use("/api", require("./routers/fireReportRouter.js"));
app.use("/api", require("./routers/emergencyContactRouter.js"));
app.use("/", require("./routers/viewRouters.js"));

app.use("/api", require("./routers/shelterRouter.js"));



// Socketio set up 
const http = require("http");
const server = http.createServer(app);
const socketioService = new SocketioService(server);



module.exports = {
    server: server,
    db: db,
    socketioService: socketioService
}
// entry point of whole app
//Require modules
const express = require("express");
const db = require('./utils/database');
const fs = require('fs');
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

// replace variable in static js files
replaceEnvVarInFile('./public/js/elb.js', './public/js/elb_tmp.js', '${BACKEND_HOST_URL}', process.env.BACKEND_HOST_URL);

// cors 
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
app.use("/api", require("./routers/elbRouter.js"));
app.use("/", require("./routers/viewRouters.js"));

// Socketio set up 
const http = require("http");
const server = http.createServer(app);
const socketioService = new SocketioService(server);

function replaceEnvVarInFile(src_file_name, target_file_name, src_env_name, target_env_name) {
    let fileBuffer = fs.readFileSync(src_file_name, 'utf-8');
    fileBuffer = fileBuffer.replace(src_env_name, target_env_name);
    fs.writeFileSync(target_file_name, fileBuffer);    
}

module.exports = {
    server: server,
    db: db,
    socketioService: socketioService
}
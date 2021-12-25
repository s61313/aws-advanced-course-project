// entry point of whole app
//Require modules
const express = require("express");
const db = require('./utils/database');
const fs = require('fs');
const path = require("path");
const app = express();
const SocketioService = require("./utils/socketio");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const awsSQS = require("./utils/awsSQS")
const awsSQSService = new awsSQS()
const awsElasticache = require("./utils/awsElasticache");
const awsElasticacheService = new awsElasticache();


// replace variable in static js files
replaceEnvVarInFile('./public/js/elb_template.js', './public/js/elb.js', '${BACKEND_HOST_URL}', process.env.BACKEND_HOST_URL);
replaceEnvVarInFile('./public/js/elbex1_template.js', './public/js/elbex1.js', '${BACKEND_HOST_URL}', process.env.BACKEND_HOST_URL);
replaceEnvVarInFile('./public/js/elasticache_ex_template.js', './public/js/elasticache_ex.js', '${BACKEND_HOST_URL}', process.env.BACKEND_HOST_URL);
replaceEnvVarInFile('./public/js/cloudfront_signedcookie_template.js', './public/js/cloudfront_signedcookie.js', '${CF_URL}', process.env.CF_URL);

// cors 
app.use(cors());

// cookie
app.use(cookieParser());

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
app.all('/api', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use("/api", require("./routers/elbRouter.js"));
app.use("/api", require("./routers/sqsRouter.js"));
app.use("/api", require("./routers/elasticacheRouter.js"));
app.use("/api", require("./routers/cloudfrontRouter.js"));
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
    socketioService: socketioService,
    awsSQSService: awsSQSService,
    awsElasticacheService: awsElasticacheService
}
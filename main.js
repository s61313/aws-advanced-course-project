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
let myenv_list = [];
myenv_list.push({src_env_name: '${BACKEND_HOST_URL}', target_env_name: process.env.BACKEND_HOST_URL});
myenv_list.push({src_env_name: '${CF_RESOURCE_HOST_URL}', target_env_name: process.env.CF_RESOURCE_HOST_URL});
replaceMultipleEnvVarInFile('./public/js/all_homepage_template.js', './public/js/all_homepage.js', myenv_list);
replaceMultipleEnvVarInFile('./public/js/all_agenda_template.js', './public/js/all_agenda.js', myenv_list);
replaceEnvVarInFile('./public/js/all_buy_ticket_temlpate.js', './public/js/all_buy_ticket.js', '${BUY_TICKET_BACKEND_HOST_URL}', process.env.BUY_TICKET_BACKEND_HOST_URL);
let myenv_list2 = [];
myenv_list2.push({src_env_name: '${BACKEND_HOST_URL}', target_env_name: process.env.BACKEND_HOST_URL});
myenv_list2.push({src_env_name: '${SQS_QUEUE_URL}', target_env_name: process.env.SQS_QUEUE_URL});
replaceMultipleEnvVarInFile('./public/js/all_admin_template.js', './public/js/all_admin.js', myenv_list2);



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
app.use("/api", require("./routers/allRouter.js"));
app.use("/", require("./routers/viewRouters.js"));

// Socketio set up 
const http = require("http");
const server = http.createServer(app);
const socketioService = new SocketioService(server);

function replaceMultipleEnvVarInFile(src_file_name, target_file_name, env_list) {
    let fileBuffer = fs.readFileSync(src_file_name, 'utf-8');
    for (let i = 0; i < env_list.length; i++) {
        let myenv = env_list[i];
        fileBuffer = fileBuffer.replace(myenv.src_env_name, myenv.target_env_name);
    }
    fs.writeFileSync(target_file_name, fileBuffer);    
}

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
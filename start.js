const app = require("./main.js");
const PORT = process.env.PORT || 8080;



// elasticache setup 
const start_function = async () => {


    // sqs consumer setup (we use Lambda as consumer instead)
    // console.log("is_queue_enabled_on_startup: ", process.env.IS_QUEUE_ENABLED_ON_STARTUP);
    console.log("SQS_QUEUE_URL: ", process.env.SQS_QUEUE_URL);
    // const is_queue_enabled_on_startup = process.env.IS_QUEUE_ENABLED_ON_STARTUP;
    // if (is_queue_enabled_on_startup === 'true') {
    //     const sqs_queue_url = process.env.SQS_QUEUE_URL;
    //     app.awsSQSService.process_queue_msg_continue(sqs_queue_url)    
    // }

    // db setup 
    // app.db.handleDisconnect();

    // app server setup
    app.server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

}


start_function();


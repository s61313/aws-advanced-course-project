const app = require("./main.js");
const PORT = process.env.PORT || 8080;

// app server setup
app.server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// sqs consumer setup 
const sqs_queue_url = process.env.SQS_QUEUE_URL;
app.awsSQSService.process_queue_msg_continue(sqs_queue_url)

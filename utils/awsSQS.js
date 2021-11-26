
AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
const {sendBatchedMessages, sendBatchedMessagesInParallel} = require("sqs-bulk-loader")();
const myUtil = require("./myUtil")
const myUtilService = new myUtil()


class awsSQS {
    constructor() {
        this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    }

    send_msg(sqs_queue_url) {
        return new Promise((resolve, reject) => {
            
            var params = this.get_sqs_params(sqs_queue_url)
            this.sqs.sendMessage(params, function(err, data) {
               if (err) {
                 console.log("Error", err);
                 reject();
               } else {
                 console.log("Success", data.MessageId);
                 resolve(data.MessageId);
               }
             });

        })        
    }

    get_sqs_params(sqs_queue_url) {

        var message_body = {
          "process_time_ms": 1301
         }

         var params = {
            // Remove DelaySeconds parameter and value for FIFO queues
           DelaySeconds: 3,
           MessageAttributes: {
             "Title": {
               DataType: "String",
               StringValue: "The Whistler"
             },
             "Author": {
               DataType: "String",
               StringValue: "John Grisham"
             },
             "WeeksOn": {
               DataType: "Number",
               StringValue: "6"
             }
           },
           MessageBody: JSON.stringify(message_body),
           // MessageDeduplicationId: "TheWhistler",  // Required for FIFO queues
           // MessageGroupId: "Group1",  // Required for FIFO queues
           QueueUrl: sqs_queue_url
         };   
         
         return params
    }

    send_msg_batch(sqs_queue_url, sqs_msg_number) {    

      return new Promise(async (resolve, reject) => {
        var messages = this.get_messages_to_send(sqs_msg_number)        
        const response = await sendBatchedMessagesInParallel(sqs_queue_url, messages);
        console.log(response);
        resolve(response);
        
      }) 
    }

    get_messages_to_send(sqs_msg_number) {
      var messages = []
      var id_count = 1
      while (sqs_msg_number > 0) {
        const id_now = myUtilService.uuidv4()
        let process_time_ms = 1102
        messages.push({
          "Id": id_now,
          "MessageBody": `{"process_time_ms": "${process_time_ms}"}`
        })
        id_count++;
        sqs_msg_number--;
      }        
      return messages;
    }

    get_queue_attr(sqs_queue_url) {    

      return new Promise(async (resolve, reject) => {

        var params = {
          QueueUrl: sqs_queue_url,
          AttributeNames : ['ApproximateNumberOfMessages'],
         };

         this.sqs.getQueueAttributes(params, function(err, data){
          if (err) {
                 console.log("Error", err);
               } else {
                 console.log(data);
                 resolve(data);
               }
          });         
         
        // var queue_attr = await this.sqs.getQueueAttributes(params);
        // resolve(queue_attr);
        
      }) 
    }    

}
module.exports = awsSQS;


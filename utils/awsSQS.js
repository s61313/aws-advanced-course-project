
AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
const {sendBatchedMessages, sendBatchedMessagesInParallel} = require("sqs-bulk-loader")();
const myUtil = require("./myUtil")
const myUtilService = new myUtil()


class awsSQS {
    constructor() {
      if (!awsSQS._instance) {
        awsSQS._instance = this;
        this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
        this.is_process_continue = false;
      }

      return awsSQS._instance;        
    }

    purge_queue(sqs_queue_url) {
      return new Promise((resolve, reject) => {
          
          var params = {
            QueueUrl: sqs_queue_url
          };
          this.sqs.purgeQueue(params, async function(err, data) {
             if (err) {
               console.log("Error", err);
               resolve();
             } else {
              //  console.log("Success", data);
               let wait_time_for_purge = 60 * 1000;
               await myUtilService.wait_for_second(wait_time_for_purge);
               resolve(data);
             }
           });
      })        
  }    


    send_msg(sqs_queue_url, boughtTicketId, agendaProvider) {
        return new Promise((resolve, reject) => {
            console.log("send_msg() called");
            var params = this.get_sqs_params(sqs_queue_url, boughtTicketId, agendaProvider);
            console.log("send_msg params: ", params);
            this.sqs.sendMessage(params, function(err, data) {
               if (err) {
                 console.log("Error", err);
                 resolve();
               } else {
                 console.log("Success", data.MessageId);
                 resolve(data.MessageId);
               }
             });

        })        
    }

    get_sqs_params(sqs_queue_url, boughtTicketId, agendaProvider) {

        var message_body = {
          "boughtTicketId": boughtTicketId,
          "agendaProvider": agendaProvider
         };

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

    send_msg_batch(sqs_queue_url, sqs_msg_number, process_time_ms) {    

      return new Promise(async (resolve, reject) => {
        var messages = this.get_messages_to_send(sqs_msg_number, process_time_ms)        
        const response = await sendBatchedMessagesInParallel(sqs_queue_url, messages);
        // console.log("sqs send msg - res", response);
        resolve(response);
        
      }) 
    }

    get_messages_to_send(sqs_msg_number, process_time_ms) {
      var messages = []
      var id_count = 1
      while (sqs_msg_number > 0) {
        const id_now = myUtilService.uuidv4()
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
         console.log("get_queue_attr params: ", params);

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

    receive_queue_msg(sqs_queue_url) {    

      return new Promise(async (resolve, reject) => {

        var params = {
          QueueUrl: sqs_queue_url, /* required */
          AttributeNames: [
            "All"
          ],
          MaxNumberOfMessages: '1',
          MessageAttributeNames: [],
          WaitTimeSeconds: '3'
        };
          sqs.receiveMessage(params, function(err, data) {
            if (data.Messages) {
              console.log("sqs received msg - data: " , data);              
              resolve(data.Messages);  
            }else {
              console.log("sqs received msg - err: ", err);
              resolve();
            }
        });        
      }) 
    }    

    process_queue_msg(sqs_queue_url) {    

      return new Promise(async (resolve, reject) => {
        // step1: receive msg
        const receive_queue_msg_result = await this.receive_queue_msg(sqs_queue_url)
        // step2: process and delete msg 
        if (receive_queue_msg_result) {
          for (let i = 0; i < receive_queue_msg_result.length;i++) {
            let msg_now = receive_queue_msg_result[i];
            await this.process_queue_msg_helper(sqs_queue_url, msg_now);
          }    
        }       
        
        resolve();
      }) 
    }    

    process_queue_msg_continue(sqs_queue_url) {    

      return new Promise(async (resolve, reject) => {
        if (this.is_process_continue === false) {
          this.is_process_continue = true;
          while (this.is_process_continue) {
            await this.process_queue_msg(sqs_queue_url);
          }  
        }
        resolve();
      }) 
    }

    process_queue_msg_continue_stop(sqs_queue_url) {    

      return new Promise(async (resolve, reject) => {
        this.is_process_continue = false;
        resolve();
      }) 
    }    


    process_queue_msg_helper(sqs_queue_url, msg_now) {
      return new Promise(async (resolve, reject) => {
        const body = JSON.parse(msg_now.Body);
        const process_time_ms = body.process_time_ms;
        await myUtilService.wait_for_second(process_time_ms);

        var deleteParams = {
          QueueUrl: sqs_queue_url,
          ReceiptHandle: msg_now.ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function(err, data) {
          if (err) {
            console.log("sqs deleted msg - err", err);
            resolve();
          } else {
            console.log("sqs deleted msg - data", data);
            resolve(data);  
          }
        });   
      })
    }


}
module.exports = awsSQS;


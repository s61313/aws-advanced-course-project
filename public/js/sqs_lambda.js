/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';
import User from './modules/userModule.js';

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
});

function setUpDefault() {
  $('#backendUrlId').val('http://localhost:8080')
  $('#sqsQueueUrlId').val('https://sqs.us-east-1.amazonaws.com/344458213649/sqs-for-lambda')
  $('#sqsMsgBatchNumUrlId').val('5')
}

function setupEvent(){
  // DO_THIS: design front-end page 
  $('#sendSQSmsgId').click({"input1": "value1"}, sendSQSmsgId);
}

function sendSQSmsgId(event) {
  console.log("sendSQSmsgId() called");

  let hostname = $('#backendUrlId').val()
  let sqs_queue_url = $('#sqsQueueUrlId').val()
  let sqs_msg_number = $('#sqsMsgBatchNumUrlId').val()

  // let hostname = event.data.hostname;

  var url_sqs_send_msg = `${hostname}/api/sqs/sendmsg?sqs_queue_url=${sqs_queue_url}&sqs_msg_number=${sqs_msg_number}`;
  console.log("url_sqs_send_msg: " , url_sqs_send_msg);

  $.ajax({
    url: url_sqs_send_msg,
    type: "GET",
    success: function (res) {
      console.log("url_sqs_send_msg - res: " , res);
    },
  });  

}

/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';
import User from './modules/userModule.js';

var req_count = 0;
var canvas_dataPoints = [];
var axisX_min = 0;
var axisX_max = 100;
var refreshIntervalId;
var interval_ms = 3000

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  // clearData();
});

function clearData() {
  axisX_min = 0;
  clearDatapointToCanvas();
  updateCanvas();
}

function setUpDefault() {
  $('#backendUrlId').val('http://localhost:8080')
  const min = 1;
  const max = 9999999
  const rndInt = randomIntFromInterval(min, max)
  $('#serverNoId').html(rndInt)
  // $('#sqsQueueUrlId').val('https://sqs.us-east-1.amazonaws.com/344458213649/sqs-for-lambda')
  // $('#sqsMsgBatchNumUrlId').val('5')
}

function setupEvent(){
  $('#checkawsazId').click({"input1": "value1"}, checkawsaz);
  
  // $('#sendSQSmsgId').click({"input1": "value1"}, sendSQSmsgId);
  // $('#trackSQSmsgId').click({"input1": "value1"}, trackSQSmsg);
  // $('#trackSQSmsgStopId').click({"input1": "value1"}, trackSQSmsgStop);

}

function checkawsaz() {
  console.log("checkawsaz() called");

  let hostname = $('#backendUrlId').val()

  var url_check_aws_az = `${hostname}/api/elb/az`;
  console.log("url_check_aws_az: " , url_check_aws_az);  
  
  $.ajax({
    url: url_check_aws_az,
    type: "GET",
    success: function (az_of_ec2, status, xhr) {
      console.log("url_check_aws_az - az_of_ec2: " , az_of_ec2);   
      const res_cookie = xhr.getResponseHeader('Set-Cookie');
      console.log("res_cookie: " , res_cookie);
      // const AWSALB = xhr.getResponseHeader("AWSALB");    
      // const AWSALBTG = xhr.getResponseHeader("AWSALBTG");    
      // console.log("AWSALB: " , AWSALB);   
      // console.log("AWSALBTG: " , AWSALBTG);   
      
      $('#awsazId').val(az_of_ec2)   
    },
  });   
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function trackSQSmsgStop(event) {
  console.log("trackSQSmsgStop() called");
  clearInterval(refreshIntervalId);
  $('#trackSQSmsgId').prop('disabled', false);
}

function trackSQSmsg(event){
  console.log("trackSQSmsg() called");
  $('#trackSQSmsgId').prop('disabled', true);
  refreshIntervalId = setInterval(function() { get_sqs_queue_msg_count() }, interval_ms)
}

function get_sqs_queue_msg_count() {
  console.log("get_sqs_queue_msg_count() called");

  let hostname = $('#backendUrlId').val()
  let sqs_queue_url = $('#sqsQueueUrlId').val()

  var url_sqs_attrtibute = `${hostname}/api/sqs/attrtibute?sqs_queue_url=${sqs_queue_url}`;
  console.log("url_sqs_attrtibute: " , url_sqs_attrtibute);

  $.ajax({
    url: url_sqs_attrtibute,
    type: "GET",
    success: function (res) {
      console.log("url_sqs_attrtibute - res: " , res);
      console.log("url_sqs_attrtibute - ApproximateNumberOfMessages: " , res.Attributes.ApproximateNumberOfMessages);
      
      var msg_count = Number(res.Attributes.ApproximateNumberOfMessages);

      req_count++;
      addDatapointToCanvas(req_count, msg_count);
      updateCanvas();
    },
  });   

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

function updateCanvas() {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    axisY:{
      title : "message count",
      // maximum: 50,
      minimum: 0,
      titleFontSize: 14
    },    
    axisX:{
      // maximum: 30,
      title : "Interval",
      minimum: axisX_min,
      interval: 1,
      titleFontSize: 14
    },  
    title:{
      text: "Ticket Service",
      fontSize: 18
    },
    data: [{        
      type: "spline",
      dataPoints: canvas_dataPoints
    }]
  });
  chart.render();
}

function clearDatapointToCanvas() {
  req_count = 0;
  canvas_dataPoints = [];
}

function addDatapointToCanvas(_x, _y){
  canvas_dataPoints.push({ x: _x, y: _y })
  maintain_fixed_axis(_x, canvas_dataPoints)
}

function maintain_fixed_axis(_x, canvas_dataPoints) {
  console.log(` canvas_dataPoints.length: ${canvas_dataPoints.length} `) 
  if (canvas_dataPoints.length > axisX_max) {
    canvas_dataPoints.shift()
    axisX_min = _x - axisX_max;
  }
}



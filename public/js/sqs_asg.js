/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var chart;

var req_count = 0;
var canvas_dataPoints = [];
var axisX_min = 0;
var axisX_max = 100;
var refreshIntervalId;
var interval_ms = 3000

var passed_color_bg = "#22a2b8";

var simulation_initiated_time; 
var simulation_finished_time;
var consecutive_zero_msg_count = 0;
const consecutive_zero_msg_count_target = 8;

var sqs_msg_number = 9; 
var process_time_ms = 20 * 1000; 
const simulation_target_time = 200 * 1000; 

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

function clearData() {
  axisX_min = 0;
  consecutive_zero_msg_count = 0;
  initializeCanvas();
}

function setUpDefault() {
  $('#backendUrlId').val('http://localhost:8080')
  $('#sqsQueueUrlId').val('https://sqs.us-east-1.amazonaws.com/344458213649/sqs-asg-001')
}

function setupEvent(){
  $('#caseNormalDemandId').click({"input1": "value1"}, start_normal_demand_simulation);
  $('#caseNormalDemandStopId').click({"input1": "value1"}, end_normal_demand_simulation);
}

function end_normal_demand_simulation(event) {
  console.log("end_normal_demand_simulation() called");
  clearInterval(refreshIntervalId);
  $('#caseNormalDemandId').prop('disabled', false);
}

async function start_normal_demand_simulation(event){
  console.log("start_normal_demand_simulation() called");
  $('#caseNormalDemandId').prop('disabled', true);

  // step: purge current msg (60s)
  await purge_sqs_queue();

  // step: send batch msg
  await send_sqs_msg(sqs_msg_number, process_time_ms);

  // step: track status
  simulation_initiated_time = new Date().getTime();
  consecutive_zero_msg_count = 0;
  refreshIntervalId = setInterval(function() { verify_result() }, interval_ms)
}

function verify_result() {
  // console.log("verify_result() called");

  let hostname = $('#backendUrlId').val()
  let sqs_queue_url = $('#sqsQueueUrlId').val()

  var url_sqs_attrtibute = `${hostname}/api/sqs/attrtibute?sqs_queue_url=${sqs_queue_url}`;
  // console.log("url_sqs_attrtibute: " , url_sqs_attrtibute);

  $.ajax({
    url: url_sqs_attrtibute,
    type: 'GET'
  })
  .done(function (res) { 
    // console.log("url_sqs_attrtibute - res: " , res);
    var msg_count = Number(res.Attributes.ApproximateNumberOfMessages);
    
    if (msg_count == 0) {
      consecutive_zero_msg_count++;
    }else {
      consecutive_zero_msg_count = 0;
    }

    if (consecutive_zero_msg_count >= consecutive_zero_msg_count_target) {
      const is_passed = check_result_status();
      update_result_status(is_passed);   
      clearInterval(refreshIntervalId);   
    }

    req_count++;
    addDatapointToCanvas(req_count, msg_count);
    updateCanvas();

  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log("url_sqs_attrtibute - err: " , errorThrown);
  });

}

function check_result_status() {
  simulation_finished_time = new Date().getTime();
  let simulation_spent_time = simulation_finished_time - simulation_initiated_time;
  let simulation_spent_time_sec = simulation_spent_time / 1000;
  console.log(`${simulation_spent_time_sec} seconds vs ${simulation_target_time/1000} second`);
  if (simulation_spent_time <= simulation_target_time) {
    return true;
  }

  return false;
}

function update_result_status(is_passed) {
  if (is_passed) {
    $('#caseNormalDemandId').prop('disabled', true);
    $("#caseNormalDemandId").html('Simulation: normal demand (PASSED!)');
    $("#caseNormalDemandId").css("background-color", passed_color_bg);

    $('#caseNormalDemandStopId').prop('disabled', true);
    $("#caseNormalDemandStopId").html('20 points');
    $("#caseNormalDemandStopId").css("background-color", passed_color_bg);
  }else{
    $("#caseNormalDemandId").html('Simulation: normal demand (NOT PASSED - TAKE_TOO_MUCH_TIME)');
  }
}

function purge_sqs_queue() {

  return new Promise(async (resolve, reject) => {
    console.log("purge_sqs_queue() called");
    $("#caseNormalDemandId").html('Simulation: normal demand (NOT PASSED - PURGING ...)');

    let hostname = $('#backendUrlId').val()
    let sqs_queue_url = $('#sqsQueueUrlId').val()
  
    var url_purge_sqs_queue = `${hostname}/api/sqs/purge?sqs_queue_url=${sqs_queue_url}`;
    console.log("url_purge_sqs_queue: " , url_purge_sqs_queue);
  
    $.ajax({
      url: url_purge_sqs_queue,
      type: "GET",
      success: function (res) {
        console.log("url_purge_sqs_queue - res: " , res);
        $("#caseNormalDemandId").html('Simulation: normal demand (NOT PASSED - PURGING FINISHED)');
        resolve();
      },
    });      
  })   

}

function send_sqs_msg(sqs_msg_number, process_time_ms) {

  return new Promise(async (resolve, reject) => {
    console.log("send_sqs_msg() called");

    let hostname = $('#backendUrlId').val()
    let sqs_queue_url = $('#sqsQueueUrlId').val()
  
    var url_sqs_send_msg = `${hostname}/api/sqs/sendmsg?sqs_queue_url=${sqs_queue_url}&sqs_msg_number=${sqs_msg_number}&process_time_ms=${process_time_ms}`;
    console.log("url_sqs_send_msg: " , url_sqs_send_msg);
  
    $.ajax({
      url: url_sqs_send_msg,
      type: "GET",
      success: function (res) {
        // console.log("url_sqs_send_msg - res: " , res);
        resolve();
      },
    });         
  })   

}

function initializeCanvas() {
  clearDatapointToCanvas();
  chart = new CanvasJS.Chart("chartContainer", {
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
  updateCanvas();
}
function updateCanvas() {
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
  // console.log(` canvas_dataPoints.length: ${canvas_dataPoints.length} `) 
  if (canvas_dataPoints.length > axisX_max) {
    canvas_dataPoints.shift()
    axisX_min = _x - axisX_max;
  }
}



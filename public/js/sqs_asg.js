/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var chart;

var req_count = 0;
var canvas_dataPoints = [];
var axisX_min = 0;
var axisX_max = 50;
const canvas_x_min_update_interval = 10;

var refreshIntervalId_basic;
var refreshIntervalId;
var refreshIntervalId_high_demand;
var interval_ms = 3000

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";

var simulation_initiated_time; 
var simulation_finished_time;
var consecutive_zero_msg_count = 0;
const consecutive_zero_msg_count_target = 8;
var process_time_ms = 20 * 1000; 
var backlog_per_instance_target = 3;

var sqs_msg_number_basic = 9; 
const simulation_target_time_basic = 100000000 * 1000; 

var sqs_msg_number = 9; 
const simulation_target_time = ( (sqs_msg_number/backlog_per_instance_target) * 2 * process_time_ms + consecutive_zero_msg_count_target * interval_ms + 5 * 1000); 

var sqs_msg_number_high_demand = 30; 
const simulation_target_time_high_demand = 200 * 1000; 

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

function clearData() {
  axisX_min = 0;
  consecutive_zero_msg_count = 0;
  clearDatapointToCanvas();
  initializeCanvas();
}

function setUpDefault() {
  $('#backendUrlId').val('http://localhost:8080')
  $('#sqsQueueUrlId').val('https://sqs.us-east-1.amazonaws.com/344458213649/sqs-asg-001')
}

function setupEvent(){
  
  $('#caseBasicId').click({"input1": "value1"}, start_basic_simulation);
  $('#caseBasicStopId').click({"input1": "value1"}, end_basic_simulation);

  $('#caseNormalDemandId').click({"input1": "value1"}, start_normal_demand_simulation);
  $('#caseNormalDemandStopId').click({"input1": "value1"}, end_normal_demand_simulation);

  $('#caseHighDemandId').click({"input1": "value1"}, start_high_demand_simulation);
  $('#caseHighDemandStopId').click({"input1": "value1"}, end_high_demand_simulation);

}

function end_basic_simulation(event) {
  console.log("end_basic_simulation() called");
  clearInterval(refreshIntervalId_basic);
  $('#caseBasicId').prop('disabled', false);
  $("#caseBasicId").html('Simulation: basic (NOT PASSED)');
  $("#caseBasicId").css("background-color", notpassed_color_bg);
}

function end_normal_demand_simulation(event) {
  console.log("end_normal_demand_simulation() called");
  clearInterval(refreshIntervalId);
  $('#caseNormalDemandId').prop('disabled', false);
  $("#caseNormalDemandId").html('Simulation: normal demand (NOT PASSED)');
  $("#caseNormalDemandId").css("background-color", notpassed_color_bg);
}


function end_high_demand_simulation(event) {
  console.log("end_high_demand_simulation() called");
  clearInterval(refreshIntervalId_high_demand);
  $('#caseHighDemandId').prop('disabled', false);
}


async function start_basic_simulation(event){
  console.log("start_basic_simulation() called");
  $("#caseBasicId").css("background-color", notpassed_color_bg);
  $('#caseBasicId').prop('disabled', true);

  // step: purge current msg (60s)
  // await purge_sqs_queue();

  // step: send batch msg
  await send_sqs_msg(sqs_msg_number_basic, process_time_ms);

  // step: track status
  simulation_initiated_time = new Date().getTime();
  consecutive_zero_msg_count = 0;
  refreshIntervalId_basic = setInterval(function() { verify_result('case_basic') }, interval_ms)
}


async function start_normal_demand_simulation(event){
  console.log("start_normal_demand_simulation() called");
  $("#caseNormalDemandId").css("background-color", notpassed_color_bg);
  $('#caseNormalDemandId').prop('disabled', true);

  // step: purge current msg (60s)
  // await purge_sqs_queue();

  // step: send batch msg
  await send_sqs_msg(sqs_msg_number, process_time_ms);

  // step: track status
  simulation_initiated_time = new Date().getTime();
  consecutive_zero_msg_count = 0;
  refreshIntervalId = setInterval(function() { verify_result('case_normal_demand') }, interval_ms)
}


async function start_high_demand_simulation(event){
  console.log("start_high_demand_simulation() called");
  $('#caseHighDemandId').prop('disabled', true);

  // step: purge current msg (60s)
  await purge_sqs_queue();

  // step: send batch msg
  await send_sqs_msg(sqs_msg_number_high_demand, process_time_ms);

  // step: track status
  simulation_initiated_time = new Date().getTime();
  consecutive_zero_msg_count = 0;
  refreshIntervalId_high_demand = setInterval(function() { verify_result('case_high_demand') }, interval_ms)
}


function verify_result(case_type) {
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
      if (case_type === 'case_basic') {
        const is_passed = check_result_status(simulation_target_time_basic);
        update_result_status_basic(is_passed);   
        clearInterval(refreshIntervalId_basic);
      }else if (case_type === 'case_normal_demand') {
        const is_passed = check_result_status(simulation_target_time);
        update_result_status(is_passed);   
        clearInterval(refreshIntervalId);
      }else if (case_type === 'case_high_demand') {
        const is_passed = check_result_status(simulation_target_time_high_demand);
        update_result_status_high_demand(is_passed);
        clearInterval(refreshIntervalId_high_demand);
      }
    }

    req_count++;
    addDatapointToCanvas(req_count, msg_count);

  })
  .fail(function (jqXHR, textStatus, errorThrown) {
    console.log("url_sqs_attrtibute - err: " , errorThrown);
  });

}

function check_result_status(target_time) {
  simulation_finished_time = new Date().getTime();
  let simulation_spent_time = simulation_finished_time - simulation_initiated_time;
  let simulation_spent_time_sec = simulation_spent_time / 1000;
  console.log(`${simulation_spent_time_sec} seconds vs ${target_time/1000} second`);
  if (simulation_spent_time <= target_time) {
    return true;
  }
  return false;
}


function update_result_status_basic(is_passed) {
  if (is_passed) {
    $('#caseBasicId').prop('disabled', true);
    $("#caseBasicId").html('Simulation: normal demand (PASSED!)');
    $("#caseBasicId").css("background-color", passed_color_bg);

    $('#caseBasicStopId').prop('disabled', true);
    $("#caseBasicStopId").html('20 points');
    $("#caseBasicStopId").css("background-color", passed_color_bg);
  }else{
    $("#caseBasicId").html('Simulation: normal demand (NOT PASSED - TAKE_TOO_MUCH_TIME)');
    $("#caseBasicId").css("background-color", notpassed_toolong_color_bg);
  }
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
    $("#caseNormalDemandId").css("background-color", notpassed_toolong_color_bg);
  }
}

function update_result_status_high_demand(is_passed) {
  if (is_passed) {
    $('#caseHighDemandId').prop('disabled', true);
    $("#caseHighDemandId").html('Simulation: normal demand (PASSED!)');
    $("#caseHighDemandId").css("background-color", passed_color_bg);

    $('#caseHighDemandStopId').prop('disabled', true);
    $("#caseHighDemandStopId").html('20 points');
    $("#caseHighDemandStopId").css("background-color", passed_color_bg);
  }else{
    $("#caseHighDemandId").html('Simulation: normal demand (NOT PASSED - TAKE_TOO_MUCH_TIME)');
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
  chart.render();
}

function clearDatapointToCanvas() {
  req_count = 0;
  canvas_dataPoints = [];
}

function addDatapointToCanvas(_x, _y){
  canvas_dataPoints.push({ x: _x, y: _y });
  maintain_fixed_axis(_x, canvas_dataPoints);
  chart.render();
}

function maintain_fixed_axis(_x, canvas_dataPoints) {
  // console.log(` canvas_dataPoints.length: ${canvas_dataPoints.length} `) 
  if ( canvas_dataPoints.length > (axisX_max + canvas_x_min_update_interval) ) {
    
    var canvas_x_min_update_interval_count = canvas_x_min_update_interval;
    while (canvas_x_min_update_interval_count > 0) {
      canvas_dataPoints.shift();
      axisX_min++;
      canvas_x_min_update_interval_count--;
    }
    initializeCanvas();
    // axisX_min = _x - axisX_max;
  }
}



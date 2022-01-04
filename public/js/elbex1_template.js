import User from './modules/userModule.js';

// const owner = sessionStorage.getItem('username');
// const userList = $("#user-list");

var canvas_dataPoints = [];
var ticket_req_count = 0;
var is_passed_g_case_1 = false;
var is_passed_g_case_2 = false;
var is_passed_g_case_3 = false;
var passed_color_bg = "#22a2b8";
var passed_count_case = 0;
var passed_count_target_case = 3;
var refreshIntervalId_case_1;
var refreshIntervalId_case_2;
var refreshIntervalId_case_3;
var gap_time_target = 7;
var axisX_min = 0;
var axisX_max = 100;

$(document).ready(() => {
  console.log("elb.js loaded");
  setupEvent();
  clearTicketData();
});

function setupEvent(){
  $('#case1Id').click({level: "normal"}, simulate_case_1);
  $('#case2Id').click({level: "normal"}, simulate_case_2);
  $('#case3Id').click({level: "normal"}, simulate_case_3);

  // $('#buyTicketId').click({level: "normal"}, buyTicket);
  // $('#buyTicketVipId').click({level: "vip"}, buyTicket);
  
  $('#case1StopId').click(clearTicketData);
  $('#case2StopId').click(clearTicketData);
  $('#case3StopId').click(clearTicketData);
  // $('#clearTicketDataVipId').click(clearTicketData);
}

function clearDatapointToCanvas() {
  ticket_req_count = 0;
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

function updateCanvas(threshold_time) {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    axisY:{
      title : "Waiting Time",
      stripLines:[
        {                
          value:threshold_time
        }
      ],      
      // maximum: 50,
      minimum: 0,
      titleFontSize: 14
    },    
    axisX:{
      // maximum: 30,
      title : "Ticket Req #",
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

function clearTicketData() {
  axisX_min = 0;
  end_simulate_case_1();
  end_simulate_case_2();
  end_simulate_case_3();
  clearDatapointToCanvas();
  updateCanvas(0);
}

function simulate_case_1(event) {
  console.log("simulate_case_1 called")
  passed_count_case = 0; // back to default
  $('#case1Id').prop('disabled', true);
  $("#case1Id").html('Simulate Case 1 (Simulating ...)');
  startReqInterval('case1', 3000, 3, 8.0)
}

function simulate_case_2(event) {
  console.log("simulate_case_2 called")
  console.log("axisX_min: " , axisX_min)
  passed_count_case = 0; // back to default
  $('#case2Id').prop('disabled', true);
  $("#case2Id").html('Simulate Case 2 (Simulating ...)');
  startReqInterval('case2', 3000, 9, 8.0)
}

function simulate_case_3(event) {
  console.log("simulate_case_3 called")
  passed_count_case = 0; // back to default
  $('#case3Id').prop('disabled', true);
  $("#case3Id").html('Simulate Case 3 (Simulating ...)');
  startReqInterval('case3', 3000, 9, 17.0)
}

function startReqInterval(case_type, req_process_time, req_per_interval, threshold_time) {

  let interval_ms = req_process_time * (req_per_interval + 3)
  buyTicketMultipleTimes(case_type, req_per_interval, threshold_time)
  if (case_type == 'case1') {
    refreshIntervalId_case_1 = setInterval(function() { buyTicketMultipleTimes(case_type, req_per_interval, threshold_time) }, interval_ms)
  }else if (case_type == 'case2') {
    refreshIntervalId_case_2 = setInterval(function() { buyTicketMultipleTimes(case_type, req_per_interval, threshold_time) }, interval_ms)
  }else if (case_type == 'case3') {
    refreshIntervalId_case_3 = setInterval(function() { buyTicketMultipleTimes(case_type, req_per_interval, threshold_time) }, interval_ms)
  }
}

function end_simulate_case_1() {
  $('#case1Id').prop('disabled', false);
  clearInterval(refreshIntervalId_case_1);
  updateStatusOnCase1();
}

function end_simulate_case_2() {
  $('#case2Id').prop('disabled', false);
  clearInterval(refreshIntervalId_case_2);
  updateStatusOnCase2();
}

function end_simulate_case_3() {
  $('#case3Id').prop('disabled', false);
  clearInterval(refreshIntervalId_case_3);
  updateStatusOnCase3();
}


function updateStatusOnCase1(){
  if (is_passed_g_case_1) {
    $('#case1Id').prop('disabled', true);
    $("#case1Id").html('Simulate Case 1 (PASSED!)');
    $("#case1Id").css("background-color", passed_color_bg);

    $('#case1StopId').prop('disabled', true);
    $("#case1StopId").html('20 points');
    $("#case1StopId").css("background-color", passed_color_bg);
  }else{
    $("#case1Id").html('Simulate Case 1 (NOT PASSED)');
  }
}

function updateStatusOnCase2(){
  if (is_passed_g_case_2) {
    $('#case2Id').prop('disabled', true);
    $("#case2Id").html('Simulate Case 2 (PASSED!)');
    $("#case2Id").css("background-color", passed_color_bg);

    $('#case2StopId').prop('disabled', true);
    $("#case2StopId").html('40 points');
    $("#case2StopId").css("background-color", passed_color_bg);
  }else{
    $("#case2Id").html('Simulate Case 2 (NOT PASSED)');
  }
}

function updateStatusOnCase3(){
  if (is_passed_g_case_3) {
    $('#case3Id').prop('disabled', true);
    $("#case3Id").html('Simulate Case 3 (PASSED!)');
    $("#case3Id").css("background-color", passed_color_bg);

    $('#case3StopId').prop('disabled', true);
    $("#case3StopId").html('40 points');
    $("#case3StopId").css("background-color", passed_color_bg);
  }else{
    $("#case3Id").html('Simulate Case 3 (NOT PASSED)');
  }
}

async function buyTicketMultipleTimes(case_type, num, threshold_time) {

  let buyTicket_promise_array = []
  for (let j = 0; j < num ;j++) {
    let buyTicket_promise = buyTicket(case_type, threshold_time);
    buyTicket_promise_array.push(buyTicket_promise);
  }

  Promise.all(buyTicket_promise_array).then((result) => {
    console.log('Promise.all all done this round: ')
    verify_simulate_case(case_type, result, threshold_time)
    console.log(result)
  }).catch((error) => {
    console.log('Promise.all has errors: ')
    console.log(error)
  })

}

function verify_simulate_case(case_type, result, threshold_time) {
  let is_higher = false;
  let i;
  let process_time_max = -1;
  for (i = 0; i < result.length ;i++) {
    let process_time = result[i].process_time
    process_time_max = Math.max(process_time_max, process_time)
    if (process_time > threshold_time) {
      is_higher = true;
      break;
    }
  }

  if (is_higher == false) {
    console.log("simulate_case passed")
    if (case_type == 'case3') {
      let gap_time = threshold_time - process_time_max;
      console.log(`${threshold_time} - ${process_time_max} = ${gap_time}`);
      if (gap_time <= gap_time_target) {
        passed_count_case++;
      }
    }else {
      passed_count_case++;
    }
    
    console.log('passed_count_case: ' , passed_count_case);
    if (passed_count_case >= passed_count_target_case) {
      console.log("simulate_case passed all")
      if (case_type == 'case1') {
        is_passed_g_case_1 = true
        end_simulate_case_1()  
      }else if (case_type == 'case2') {
        is_passed_g_case_2 = true
        end_simulate_case_2()
      }else if (case_type == 'case3') {
        is_passed_g_case_3 = true
        end_simulate_case_3()
      }
    }  

  }else {
    passed_count_case = 0; // back to default
  }
 
}

function buyTicket(threshold_time) {
  return new Promise((resolve, reject) => {
    console.log("buyTicket called");
    const req_issued_time = new Date().getTime();
    const hostname = "${BACKEND_HOST_URL}";
    var url_buyticket = `${hostname}/api/elb/buyticket?req_issued_time=${req_issued_time}`;
    $.ajax({
      url: url_buyticket,
      type: "GET"
    }).done(function(res) {
      console.log("buyTicket - res: " , res);
      ticket_req_count++;
      addDatapointToCanvas(ticket_req_count, res.process_time);
      updateCanvas(threshold_time);
      resolve(res);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      reject(jqXHR);
    }).always(function() {
      
    });    
    ;
  })
}


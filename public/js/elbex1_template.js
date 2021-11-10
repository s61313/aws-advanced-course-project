import User from './modules/userModule.js';

// const owner = sessionStorage.getItem('username');
// const userList = $("#user-list");

var canvas_dataPoints = [];
var ticket_req_count = 0;
var is_passed_g = false;
var passed_color_bg = "#22a2b8";
var threshold_time_case_1 = 8.0;
var passed_count_case_1 = 0;
var passed_count_target_case_1 = 3;

$(document).ready(() => {
  console.log("elb.js loaded");
  setupEvent();

  // addDatapointToCanvas(1, 3);
  clearTicketData();
  // updateCanvas();

  // sessionStorage.removeItem("talkingToUsername");
  // sessionStorage.removeItem("privateMsgUserJson");
  // new User().getUserList();
});

function setupEvent(){
  $('#case1Id').click({level: "normal"}, simulate_case_1);

  // $('#buyTicketId').click({level: "normal"}, buyTicket);
  // $('#buyTicketVipId').click({level: "vip"}, buyTicket);
  
  $('#case1StopId').click(clearTicketData);
  // $('#clearTicketDataVipId').click(clearTicketData);
}

function clearDatapointToCanvas() {
  ticket_req_count = 0;
  canvas_dataPoints = [];
}

function addDatapointToCanvas(_x, _y){
  canvas_dataPoints.push({ x: _x, y: _y })
}

function updateCanvas() {
  var chart = new CanvasJS.Chart("chartContainer", {
    animationEnabled: true,
    theme: "light2",
    axisY:{
      title : "Waiting Time",
      // maximum: 50,
      minimum: 0,
      titleFontSize: 14
    },    
    axisX:{
      // maximum: 30,
      title : "Ticket Req #",
      minimum: 0,
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
  stopReqInterval();
  clearDatapointToCanvas();
  updateCanvas();
}

var refreshIntervalId
function simulate_case_1(event) {
  console.log("simulate_case_1 called")
  startReqInterval()
  
  // let round = 5;
  // for (let i = 0; i < round ;i++) {    
  //   for (let j = 0; j < req_per_interval ;j++) {
  //     buyTicket();
  //   }
  //   wait(interval_ms);  //7 seconds in milliseconds
  // }

  // clearInterval(refreshIntervalId);
}

function startReqInterval() {
  $('#case1Id').prop('disabled', true);
  $("#case1Id").html('Simulate Case 1 (Simulating ...)');

  let req_process_time = 3000
  let req_per_interval = 3
  let interval_ms = req_process_time * (req_per_interval * 2)
  buyTicketMultipleTimes(req_per_interval)
  refreshIntervalId = setInterval(function() { buyTicketMultipleTimes(req_per_interval) }, interval_ms)
}

function stopReqInterval() {
  $('#case1Id').prop('disabled', false);
  clearInterval(refreshIntervalId);
  updateStatusOnCase1();
}

function updateStatusOnCase1(){
  if (is_passed_g) {
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

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}

async function buyTicketMultipleTimes(num) {

  let buyTicket_promise_array = []
  for (let j = 0; j < num ;j++) {
    let buyTicket_promise = buyTicket();
    buyTicket_promise_array.push(buyTicket_promise);
  }

  Promise.all(buyTicket_promise_array).then((result) => {
    console.log('Promise.all all done this round: ')
    verify_simulate_case_1(result)
    console.log(result)
  }).catch((error) => {
    console.log('Promise.all has errors: ')
    console.log(error)
    // stopReqInterval()
  })

}

function verify_simulate_case_1(result) {
  let is_higher = false;
  let i;
  for (i = 0; i < result.length ;i++) {
    let process_time = result[i].process_time
    if (process_time > threshold_time_case_1) {
      is_higher = true;
      break;
    }
  }

  if (is_higher == false) {
    console.log("simulate_case_1 passed")
    passed_count_case_1++;
    if (passed_count_case_1 >= passed_count_target_case_1) {
      console.log("simulate_case_1 passed all")
      is_passed_g = true
      stopReqInterval()
    }
  }
 
}

function buyTicket() {
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
      updateCanvas();
      resolve(res);
    }).fail(function(jqXHR, textStatus, errorThrown) {
      reject(jqXHR);
    }).always(function() {
      
    });    
    ;
  })
}


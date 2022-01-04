/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";
var rows_per_page = 500;
var processed_time_total = 0;
var cached_checker = new Set();
var canvas_dataPoints = [];
var ticket_req_count = 0;

const buy_ticket_backend_url = "${BUY_TICKET_BACKEND_HOST_URL}";
// const buy_ticket_backend_url = "http://localhost:8080";

$(document).ready(() => {
  console.log("all_homepage.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

async function clearData() {
}

function setUpDefault() {
  // $('#backendUrlId').val('http://localhost:8080') 
  clearTicketData();
}

function setupEvent(){  
  $('#buyTicketId').click({level: "normal"}, buyTicket);
  $('#clearTicketDataId').click(clearTicketData);
}

function clearTicketData() {
  clearDatapointToCanvas();
  updateCanvas();
}

function clearDatapointToCanvas() {
  ticket_req_count = 0;
  canvas_dataPoints = [];
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

function buyTicket(event) {
  console.log("buyTicket called");
  console.log("buyTicket called event.data.level: " , event.data.level);
  const req_issued_time = new Date().getTime();
  let agendaPovider = $('#agendaPovider').val();

  var url_buyticket = `${buy_ticket_backend_url}/api/all/buyticket?req_issued_time=${req_issued_time}&agendaPovider=${agendaPovider}`; // DO-THIS: add api 

  $.ajax({
    url: url_buyticket,
    type: "GET",
    success: function (res) {
      console.log("buyTicket - res: " , res);
      // HERE001
      ticket_req_count++;
      addDatapointToCanvas(ticket_req_count, res.process_time);
      updateCanvas();
      // $("#tbody_ticket").append(getProcessedTicketRowView(res.ticket_id, res.process_time));
    },
  });
}

function addDatapointToCanvas(_x, _y){
  canvas_dataPoints.push({ x: _x, y: _y })
}

function appendAgendaRows(agenda_list) {
  $("#agendaId").html("");
  for (var i = 0; i < agenda_list.length ;i++) {
    const agenda = agenda_list[i];
    $("#agendaId").append(getAgendaRowView(agenda.startendtime, agenda.topic, agenda.speaker));
  }
} 

function getAgendaRowView(startendtime, topic, speaker) {
  return  `
          <tr>
          <td>${startendtime}</td>
          <td>${topic}</td>
          <td>${speaker}</td>
          </tr>
          `
}
import User from './modules/userModule.js';

// const owner = sessionStorage.getItem('username');
// const userList = $("#user-list");

var canvas_dataPoints = [];
var ticket_req_count = 0;

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
  $('#buyTicketId').click({level: "normal"}, buyTicket);
  $('#buyTicketVipId').click({level: "vip"}, buyTicket);
  
  $('#clearTicketDataId').click(clearTicketData);
  $('#clearTicketDataVipId').click(clearTicketData);
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
  clearDatapointToCanvas();
  updateCanvas();
}

function buyTicket(event) {
  console.log("buyTicket called");
  console.log("buyTicket called event.data.level: " , event.data.level);
  const req_issued_time = new Date().getTime();
  const hostname = "${BACKEND_HOST_URL}";

  var url_buyticket = '';
  if (event.data.level === "normal") {
    url_buyticket = `${hostname}/api/elb/buyticket?req_issued_time=${req_issued_time}`;
  } else if (event.data.level === "vip") {
    url_buyticket = `${hostname}/api/elb/vip/buyticket?req_issued_time=${req_issued_time}`
  }
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

// function getProcessedTicketRowView(ticket_id, process_time) {
//   let process_time_sec = process_time/1000;
//   return  `
//           <tr>
//             <th scope="row">${ticket_id}</th>
//             <td>${process_time_sec}</td>
//           </tr>  
//           `
// }


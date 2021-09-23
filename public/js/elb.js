import User from './modules/userModule.js';

// const owner = sessionStorage.getItem('username');
// const userList = $("#user-list");
$(document).ready(() => {
  console.log("cloudwatch.js loaded");
  triggerTestingEndpoint();
  setupEvent();

  // sessionStorage.removeItem("talkingToUsername");
  // sessionStorage.removeItem("privateMsgUserJson");
  // new User().getUserList();
});

function setupEvent(){
  $('#buyTicketId').click(buyTicket);
}

function buyTicket() {
  console.log("buyTicket called");
  $.ajax({
    url: "/api/elb/buyticket",
    type: "GET",
    success: function (res) {
      console.log("success api - res: " , res);
    },
  });
}

function triggerTestingEndpoint() {
  $.ajax({
    url: "/api/cloudwatch/metrics",
    type: "GET",
    success: function (res) {
      console.log("success api");
    },
  });
}

// $("#dir-btn").on("click", (e) => {
//   $("#user-list").empty();
//   new User().getUserList();
// });





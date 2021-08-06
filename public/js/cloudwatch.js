import User from './modules/userModule.js';

// const owner = sessionStorage.getItem('username');
// const userList = $("#user-list");
$(document).ready(() => {
  console.log("cloudwatch.js loaded");
  triggerTestingEndpoint();

  // sessionStorage.removeItem("talkingToUsername");
  // sessionStorage.removeItem("privateMsgUserJson");
  // new User().getUserList();
});

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





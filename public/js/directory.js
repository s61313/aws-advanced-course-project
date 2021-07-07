import User from './modules/userModule.js';

const owner = sessionStorage.getItem('username');
const userList = $("#user-list");
$(document).ready(() => {
  sessionStorage.removeItem("talkingToUsername");
  sessionStorage.removeItem("privateMsgUserJson");
  new User().getUserList();
});


$("#dir-btn").on("click", (e) => {
  $("#user-list").empty();
  new User().getUserList();
});





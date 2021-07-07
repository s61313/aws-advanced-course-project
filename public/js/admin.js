import User from './modules/userModule.js';

const owner = sessionStorage.getItem('username');
// const userList = $("#user-manage-list");
$(document).ready(() => {
  sessionStorage.removeItem("talkingToUsername");
  sessionStorage.removeItem("privateMsgUserJson");
  // new User().getUserList(); // TODO: create another method for this page UI 
});


$("#admin-btn").on("click", (e) => {
  // TODO
  // $("#user-manage-list").empty();
  // new User().getUserList();
});





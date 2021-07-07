$(document).ready(() => {
  sessionStorage.removeItem("talkingToUsername");
  sessionStorage.removeItem("privateMsgUserJson");
  sessionStorage.clear();

  // submit the username and password
  $("#lgform").on("submit", (e) => {
    e.preventDefault();
    var sendData = getUsernameAndPassword();
    if (!sendData.password || sendData.password.length < 4) {
      showWarning(
        "password should have at least 4 characters, please try again"
      );
    } else {
      $.ajax({
        url: `/api/users/${sendData.username}`,
        type: "GET",
        dataType: "json",
        success: function (res) {
          if (res.isError === "false") {
            if (res.data.length === 0) {
              // empty data --> username doesn't exist, ask for creating new user
              $("#register-msg").modal("show");
              return;
            }
            $.ajax({
              url: `/api/users/${sendData.username}/online`,
              type: "PUT",
              data: sendData,
              dataType: "json",
              success: function (loginRes) {   // get return message from server
                // Login successful, token assigned
                if (loginRes.resCode === "loginSuccessful") {
                  sessionStorage.setItem("username", $("#username").val());
                  sessionStorage.setItem("userstatus", loginRes.data.userstatus);
                  window.location.href = window.location.origin + "/esnDir";
                } else {
                  showWarning(loginRes.resMsg);
                }
              },
            });
          } else {
            showWarning(res.resMsg);
          }
        },
      });
    }
  });

  // Press Ok Button and create new user
  $("#btn-create-user").click((e) => {
    const sendData = getUsernameAndPassword();
    // create new user
    $.ajax({
      url: "/api/users",
      type: "POST",
      data: sendData,
      dataType: "json",
      success: function (
        res // get return message from server
      ) {
        if (res.resCode === "userCreated") {
          sessionStorage.setItem("username", $("#username").val());
          $("#register-msg").modal("hide");
          window.location.href = window.location.origin + "/welcome";
        }
      },
    });
  });
});

function getUsernameAndPassword() {
  return {
    username: $("#username").val(),
    password: $("#password").val(),
  };
}

function showWarning(resMsg) {
  var warningMsg = $("#warning-msg");
  warningMsg.toggleClass("fade-in");
  warningMsg.html(resMsg);
  setTimeout(() => {
    warningMsg.toggleClass("fade-in");
  }, 2000);
}

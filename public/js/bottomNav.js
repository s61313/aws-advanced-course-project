var btnStatus;
var buttonMsg;
var username;
$(document).ready(() => {
  username = sessionStorage.getItem('username');
  checkNotificationForEcBtn(username);

  $("#bottom-nav-template").append(getBottomNavbar());
  $('#myModal').appendTo("body")
  $.ajax({
    url: `/api/emergency/alert/${username}`,
    type: "GET",
    //data:username,
    success: function (res) {
      if(!res.data[0]){
        btnStatus = 9;
        buttonMsg = 'You have no emergency contact set up, please click the contact icon to set up. <img class = "em-image" src="/assets/showEcBtn.png"></p>'
      }else{
        btnStatus = res.data[0].emergencycontactstatus;
        
        buttonMsg = getButtonMsg(btnStatus);
      }
      
    },
  });  


  $('#emergency-btn').click((e) => {
    const sendData = {
      username: username,
    };
    var emBtn = $("#emergency-btn")
    console.log(btnStatus)
    buttonMsg = getButtonMsg(btnStatus);
    if(btnStatus === 1 || btnStatus ==='1'){
      $.ajax({
        url: "/api/emergency/contact/alert/",
        type: "PUT",
        data: sendData,
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
      });
      emBtn.attr('style', 'color:grey');
    }
    $('.modal-body').empty();
    $('.modal-body').append(buttonMsg)
    
  });


  const owner = sessionStorage.getItem("username");
  if (owner === "fireReportAdmin") {
    checkUnreadmsgForAdminFireMapBtn();
  }
  checkUnreadmsgForCitizenFireMapBtn();
});









const checkNotificationForEcBtn = function (username) {
  $.ajax({
      url: "/api/emergency/contact/" + username,
      type: "GET",
      dataType: "json",
      success: function (res) {
        //add each user to html
        var is_any_pending = false;
        $.each(res.data, (index, user) => {
          if (user) {
            is_any_pending = true;
          }
        });
        // inbox notification
        var ecBtn = $("#emergencyContact-btn")
      
        if (is_any_pending) {
          ecBtn.attr('style', 'color:red');
        } else {
          ecBtn.attr("style", "color:white");
        }
      },
    });

}
function getButtonMsg(btnStatus) {
  var emBtn = $("#emergency-btn")
  if (btnStatus == 0 || btnStatus ==='0') {
    emBtn.attr('style', 'color:grey');
    return "Your request is waiting for approval";
  }
  if (btnStatus === 1 || btnStatus ==='1') {
    emBtn.attr('style', 'color:red');
    return "Your emergency contact has been alerted";
  }
  if (btnStatus === 2 || btnStatus ==='2') {
    emBtn.attr('style', 'color:grey');
    return "Your emergency contact has been alerted";
  }
  if (btnStatus === 3 || btnStatus ==='3') {
    emBtn.attr('style', 'color:yellow');
    return "Your request has been denied, please set up a new emergency contact";
  }
  if (btnStatus === 4 || btnStatus ==='4') {
    emBtn.attr('style', 'color:#33ff00');
    return "Your emergency contact has acknowledged the receipt of your alert. He/She might contact you soon.";
  }
  if (btnStatus === 9 || btnStatus ==='9') {
    emBtn.attr('style', 'color:white');
    return 'You have no emergency contact set up, please click the contact icon to set up. <img class = "em-image" src="/assets/showEcBtn.png"></p>';
  }
}


/** Insert View */
function getBottomNavbar() {
    return `      
        <nav class="navbar navbar-dark">
            <div class="mr-auto d-inline-flex">
        
                <a class="nav-link nav-txt" href="/quiz" id="quiz-btn"><em class="fa fa-book" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/shelters" id="shelter-btn"><em class="fas fa-home" aria-hidden="true"></em></a>
                <div class="dropdown show dropup">
                  <a class="nav-link nav-txt" href="#" role = "button" id="emergencyContact-btn" data-toggle="dropdown">
                  <em class="far fa-address-book" aria-haspopup="true" aria-expanded="false" aria-hidden="true"></em>
                  </a>
                  <div class="dropdown-menu">
                    <a class="dropdown-item" href="/emergencyContact">Set Up Emergency Contact</a>
                    <a class="dropdown-item" href="/emergencyRequest">View Requests</a>
                  </div>
                </div>
              
                <!-- Emergency Button needs to be centered-->
                <a class="nav-link nav-txt" href="#myModal" id="emergency-btn" data-toggle = "modal" data-target= "#myModal"> <em class="fas fa-exclamation-circle" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/activity" id="activity-btn"><em class="fa fa-hands-helping" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/fireReportMap" id="fire-map-icon"><em class="fas fa-fire" aria-hidden="true"></em></a>
                <a class="nav-link nav-txt" href="/admin" id="admin-btn"><em class="fas fa-user-lock" aria-hidden="true"></em></a>




            </div>
        </nav>
        <div class="modal fade" id="myModal">
            <div class="modal-dialog">
                <div class="modal-content"> 
                    <div class="modal-header">
                        <h5 class="modal-title">Emergency Button</h5> 
                    </div>
                    <div class="modal-body">

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss = "modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        
        
        
        
        
        `;
}

const checkUnreadmsgForAdminFireMapBtn = async function () {
  const pendingFireReports = await getPendingFireReports();
  if (pendingFireReports.length > 0) {
    if ($("title").text() === "Fire Report Map") {
      $("#admin-reports-btn").attr("style", "background-color: #CE4949");
    }
    $("#fire-map-icon").attr("style", "color:#CE4949");
  }
};

const checkUnreadmsgForCitizenFireMapBtn = async function () {
  fireReportHistory = await getFireReportHistoryByUsername();
  var uncheckExist = false;
  for (var i = 0; i < fireReportHistory.length; ++i) {
    if (fireReportHistory[i].citizenCheck === "unchecked") {
      uncheckExist = true;
    }
  }
  if (uncheckExist) {
    console.log("uncheck exist in nav bar");
    if ($("title").text() === "Fire Report Map") {
      $("#report-history-btn").attr("style", "background-color: #CE4949");
    }
    $("#fire-map-icon").attr("style", "color:#CE4949");
  }
};

function getFireReportHistoryByUsername() {
  const owner = sessionStorage.getItem("username");
  console.log("in get report by user name function");
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/fireReports?reporterUsername=${owner}`,
      type: "GET",
      success: function (res) {
        const { data } = res;
        resolve(data);
      },
    });
  });
}

function getPendingFireReports() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/fireReports?fireReportStatus=pending`,
      type: "GET",
      success: function (res) {
        const { data } = res;
        resolve(data);
      },
    });
  });
}

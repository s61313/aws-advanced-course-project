const owner = sessionStorage.getItem("username");
$(document).ready(() => {
   $("#no-unresolved-msg").hide();
  displayPendingFireReports();
  $("#go-back-btn").click((e) => {
    window.location.href = window.location.origin + "/fireReportMap";
  });
});

/**
 Unresolved fire reports list view
 */
function getPendingFireReports() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/fireReports?fireReportStatus=pending`,
      type: "GET",
      success: function (res) {
        const { data } = res;
        console.log(data);
        resolve(data);
      },
    });
  });
}

async function displayPendingFireReports() {
  const pendingFireReports = await getPendingFireReports();
  if (pendingFireReports.length == 0) {
    $("#no-unresolved-msg").show();
  }
  //console.log(pendingFireReports);
  for (var i = 0; i < pendingFireReports.length; ++i) {
    const reporterUsername = pendingFireReports[i].reporterUsername;
    const fireReportTime = pendingFireReports[i].fireReportTime;
    const fireReportId = pendingFireReports[i].fireReportId;
    $("#unresolved-fire-report-list").append(
      getUnresolvedFireReportsCard(
        fireReportId,
        reporterUsername,
        fireReportTime
      )
    );
  }
}

/**
 Unresolved fire report detail
 */
function getFireReportDetail(fireReportId) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/fireReports/${fireReportId}`,
      type: "GET",
      success: function (res) {
        const { data } = res;
        resolve(data);
      },
    });
  });
}

async function goToFireReportDetail(fireReportId) {
  const fireReportDetail = await getFireReportDetail(fireReportId);
  geocoder = new google.maps.Geocoder();
  geocoder.geocode(
    { placeId: fireReportDetail[0].fireReportLocation },
    (results, status) => {
      if (status === "OK") {
        $("#fire-report-detail-box").empty();
        $("#fire-report-detail-box").append(
          getFireReportDetailBox(
            fireReportDetail[0].reporterUsername,
            results[0].formatted_address,
            fireReportDetail[0].fireReportTime,
            fireReportDetail[0].fireReportId
          )
        );
        $("#fire-report-detail-overlay").modal("show");
      }
    }
  );
}

/**
 Update fire report status
 */
function updateFireReportStatus(fireReportId, fireReportStatus) {
  $.ajax({
    url: `/api/fireReports/${fireReportId}?fireReportStatus=${fireReportStatus}`,
    type: "PUT",
    dataType: "json",
    success: function () {
      console.log("successful updated fire report status to " + fireReportStatus);
    },
  });
  $("#fire-report-detail-overlay").modal("hide");
  window.location.href = window.location.origin + "/unresolvedFireReports";   //refresh the page
}


/**
 View 
 */
function getUnresolvedFireReportsCard(fireReportId, username, time) {
  const timeView = `<div class="small" style="color:gray;font-weight:bold;">${time}</div>`;
  return `<div class="list-group-item" onclick="goToFireReportDetail('${fireReportId}')">
      <div class="d-flex align-items-start">
        <div class="flex-grow-1 ml-3">Received a fire report from ${username} ${timeView}</div>  
      </div>
    </div>`;
}

function getFireReportDetailBox(reporter, location, time, fireReportId) {
  return `<div class="modal fade" id="fire-report-detail-overlay" tabindex="-1" role="dialog">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                  <div class="modal-content">    
                  ${getFireReportDetailHeader()}
                  ${getFireReportDetailBody(reporter, location, time)}
                  ${getFireReportDetailFooter(fireReportId)}
                  </div>
              </div>
          </div>`;
}

function getFireReportDetailHeader() {
  return `<div class="modal-header text-center">
              <h6 class="modal-title w-100 font-weight-bold">Fire Report Detail</h4>
              <button data-dismiss="modal" aria-label="Close" style="border:none; background-color: white;">
                <i class="far fa-times-circle" style="color:grey;"></i>
              </button>
          </div>`;
}

function getFireReportDetailBody(reporter, location, time) {
  return `<div class="modal-body mx-6" text-center>
              <div class="md-form mb-3" text-center>
                <h5>Received a Fire Report from ${reporter}</h5>
                </br>
                <h5>Location:</h5>
                <p>${location}</p>
                </br>
                <h5>Report Time:</h5>
                <p>${time}</p>
              </div> 
          </div>`;
}

function getFireReportDetailFooter(fireReportId) {
  return `<div class="modal-footer d-flex justify-content-center">
              <button id="approve-fire-report-btn" class="fire-report-btn" onclick="updateFireReportStatus('${fireReportId}', 'approved')">approve
              </button>
              <button id="deny-fire-report-btn" class="fire-report-btn" onclick="updateFireReportStatus('${fireReportId}', 'denied')">deny
              </button>
          </div>`;
}

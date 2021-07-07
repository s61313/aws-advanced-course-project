const owner = sessionStorage.getItem("username");
var map, marker, searchBox, geocoder, markerIcon;
var fireReportHistory;
const icons = {
  fire: {
    icon: "/assets/fire.png",
  },
};

$(document).ready(() => {
  owner === "fireReportAdmin" ? $("#map-search").hide() : $("#map-search").show()
  $("#fire-report-btn-div").append(getFireReportButtonsView());
  initMap();
  addApprovedReportsMarkerToMap();
  $("#report-a-fire-btn").click((e) => {
    $("#create-fire-report-alert-box").empty();
    if ($("#map-search").val() === undefined || $("#map-search").val() === "") {
      $("#create-fire-report-alert-box").append(getCreateFireReportAlertBox("failed"));
      $("#create-fire-report-alert-overlay").modal("show");
    } else {
          geocoder.geocode({ address: $("#map-search").val() },function (results, status) {
              if (status == google.maps.GeocoderStatus.OK)
                sendFireReport(results[0].place_id);
            });}
  });

  $("#report-history-btn").click((e) => {
    displayFireReportHistory();
    setCitizenIconToReadColor();
  });

  $("#admin-reports-btn").click((e) => {
    $("#unresolved-fire-report-list").empty();
    window.location.href = window.location.origin + "/unresolvedFireReports";
  });

  $("#fire-report-overlay").on("hidden", function () {
    document.location.reload();
  });
});

function setCitizenIconToReadColor() {
  $("#report-history-btn").attr("style", "background-color: #0062cc");
  $("#fire-map-icon").attr("style", "color:white");
}

function setCitizenIconToUnreadColor() {
  $("#report-history-btn").attr("style", "background-color: #CE4949");
  $("#fire-map-icon").attr("style", "color:#CE4949");
}

 /**
  Shared
 */
function addApprovedReportsMarkerToMap() {
  $.ajax({
    url: `/api/fireReports?fireReportStatus=approved`,
    type: "GET",
    success: function (res) {
      const { data } = res;
      $.each(data, (index, e) => {
        var service = new google.maps.places.PlacesService(map);
        service.getDetails(
          {
            placeId: e.fireReportLocation,
          },
          function (result, status) {
            if (status === "OK") {
              var marker = new google.maps.Marker({
                map: map,
                place: {
                  placeId: e.fireReportLocation,
                  location: result.geometry.location,
                },
                icon: icons.fire.icon
              });
            }
          }
        );
      });
    },
  });
}

function initMap() {
  const uluru = { lat: 34.344, lng: -118.036 };
  // The map, centered at Uluru
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: uluru,
  });

  searchBox = new google.maps.places.SearchBox(
    document.getElementById("map-search")
  );
  geocoder = new google.maps.Geocoder();

  // google.maps.event.addListener('places_changed', function() {
  //   var places = searchBox.getPlaces();
  //   var bounds = new google.maps.LatLngBounds();
  //   for (var i = 0; place = places[i]; ++i) {
  //     bounds.extend(place.geometry.location);
  //     marker.setPosition(place.geometry.location);
  //   }
  //   map.fitBounds(bounds);
  //   map.setZoom(15);
  // });
}


/**
  Citizen Api Calls
 */
function getFireReportHistoryByUsername() {
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

function sendFireReport(placeId) {
  const sendData = {
    reporterUsername: owner,
    fireReportLocation: placeId,
  };
  $.ajax({
    url: "/api/fireReports",
    type: "POST",
    data: sendData,
    dataType: "json",
    success: function (res) {
      console.log(res.isError);
      if (res.isError === "false") {
        $("#create-fire-report-alert-box").append(getCreateFireReportAlertBox("success"));
      } else {
        $("#create-fire-report-alert-box").append(getCreateFireReportAlertBox("failed"));
      }
      $("#create-fire-report-alert-overlay").modal("show");
    },
  });

  $("#map-search").val("");
}



async function displayFireReportHistory() {
  $("#fire-report-box").empty();
  $("#fire-report-box").append(getFireReportHistoryBox());
  $("#fire-report-overlay").modal("show");
  fireReportHistory = await getFireReportHistoryByUsername();

  for (var i = 0; i < fireReportHistory.length; ++i) {
    updateCitizenCheckStatus(fireReportHistory[i].fireReportId);
    const fireReportTime = fireReportHistory[i].fireReportTime;
    const fireReportStatus = fireReportHistory[i].fireReportStatus;
    geocoder.geocode(
      { placeId: fireReportHistory[i].fireReportLocation },
      (results, status) => {
        if (status === "OK") {
          $("#fire-report-history-box").append(
            getFireReporHisotryCard(
              results[0].formatted_address,
              fireReportTime,
              fireReportStatus
            )
          );
        }
      }
    );
  }

}

function updateCitizenCheckStatus(fireReportId) {
  $.ajax({
    url: `/api/fireReports/${fireReportId}?citizenCheck=checked`,
    type: "PUT",
    dataType: "json",
    success: function () {
      ;
    }
  });
}


/**
 View 
 */
function getFireReportButtonsView() {
  var fireReportButtons;
  if (owner === "fireReportAdmin") {
    fireReportButtons = `<div>
      <button class="fire-report-btn" id="admin-reports-btn">reports</button>
    </div>`;
  } else {
    fireReportButtons = `<div><button class="fire-report-btn" id="report-a-fire-btn">report a fire</button>
      <button class="fire-report-btn" id="report-history-btn">report history</button></div>`;
  }
  return fireReportButtons;
}

function getFireReportHistoryBox() {
  return `<div class="modal fade" id="fire-report-overlay" tabindex="-1" role="dialog">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                  <div class="modal-content">    
                  ${getFireReportHeader()}
                  ${getFireReportHistoryBody()}
                  </div>
              </div>
          </div>`;
}

function getFireReportHeader() {
  return `<div class="modal-header text-center">
              <h6 class="modal-title w-100 font-weight-bold">Your Fire Reports</h6>
              <button data-dismiss="modal" aria-label="Close" style="border:none; background-color: white;">
                <i class="far fa-times-circle" style="color:grey;"></i>
              </button>
          </div>`;
}

function getFireReportHistoryBody() {
  return `<div class="modal-body mx-6" text-center>
              <div class="md-form mb-3" id="fire-report-history-box">
              </div> 
          </div>`;
}

function getFireReportHistoryFooter() {
  return `<div class="modal-footer d-flex justify-content-center">
              <button id="check-history-ok-btn" class="fire-report-btn">OK
              </button>
          </div>`;
}

function getFireReporHisotryCard(location, time, fireReportStatus) {
  const iconName = getFireReportStatusIcon(fireReportStatus);
  const timeView = `<div class="small" style="color:gray;font-weight:bold;">${time}</div>`;
  return `<div class="list-group-item">
      <div class="d-flex align-items-start">
        <div class="flex-grow-1 ml-3">${location} ${timeView}</div>  
        <img src=${iconName} mr-1" width="20" height="20"> 
      </div>
    </div>`;
}

function getFireReportStatusIcon(fireReportStatus) {
    var iconName;
    if (fireReportStatus === "approved") {
      iconName = "/assets/approved.png";
    } else if (fireReportStatus === "denied") {
      iconName = "/assets/denied.png";
    } else {
      iconName = "/assets/pending.png";
    }
    return iconName;
}

function getFireReportStatusIconColor(fireReportStatus) {
    var iconColor;
    if (fireReportStatus === "approved") {
      iconColor = "green";
    } else if (fireReportStatus === "denied") {
      iconColor = "red";
    } else {
      iconColor = "grey";
    }
    return iconColor;
}


function getCreateFireReportAlertBox(createStatus) {
  return `<div class="modal fade" id="create-fire-report-alert-overlay" tabindex="-1" role="dialog">
              <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                  <div class="modal-content">    
                  ${
                    createStatus === "failed"
                      ? getCreateAlertBoxHeader(
                          "Failed to send the fire report, please provide fire information and retry"
                        )
                      : getCreateAlertBoxHeader(
                          "Your fire report has been sent"
                        )
                  }
                  </div>
              </div>
          </div>`;
}

function getCreateAlertBoxHeader(alertMsg) {
  return `<div class="modal-header text-center">
              <h6 class="modal-title w-100 font-weight-bold">${alertMsg}</h6>
              <button data-dismiss="modal" aria-label="Close" style="border:none; background-color: white;">
                <i class="far fa-times-circle" style="color:grey;"></i>
              </button>
          </div>`;
}

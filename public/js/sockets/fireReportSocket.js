import Notification from "../modules/notificationModule.js";
var socket = io();

socket.on("sendFireMarkerToMap", (res) => {
  console.log(res);
  if ($("title").text() === "Fire Report Map") {
    var service = new google.maps.places.PlacesService(map);
    service.getDetails(
      {
        placeId: res.fireReportLocation,
      },
      function (result, status) {
        if (status === "OK") {
          var marker = new google.maps.Marker({
            map: map,
            place: {
              placeId: res.fireReportLocation,
              location: result.geometry.location,
            },
            icon: icons.fire.icon,
          });
        }
      }
    );
  }
});

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket);
Notif.bindSessionWithFireReportTopic(socket);
Notif.notifyAnnouncement(socket);

socket.emit("bindUserNameWithSocket", sessionStorage.getItem("username")); // ***add username

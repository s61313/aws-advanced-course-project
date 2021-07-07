import Msg from '../modules/msgModule.js';
// import User from '../modules/userModule.js';
import Notification from '../modules/notificationModule.js';

var socket = io();

// receive real time message from server and print it
socket.on("public message", (res) => {
    if($('title').text() === "PublicChat")  
    {
      var data = res[0];
      new Msg().printMsg(data.sendername, data.content, data.ts, data.senderstatus);
    }
});

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket);
Notif.notifyAnnouncement(socket);
Notif.bindSessionWithFireReportTopic(socket);

socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username

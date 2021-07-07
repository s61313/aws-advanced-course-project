import Msg from '../modules/msgModule.js';

import Notification from '../modules/notificationModule.js';

var socket = io();

socket.on("private message", (res) => {
    console.log("private msg res: ", res);
    res = res[0];
    const talkingToUsername = sessionStorage.getItem("talkingToUsername");
    if (talkingToUsername) {
      if (talkingToUsername === res.senderName || res.senderName === sessionStorage.getItem("username")) {
        new Msg().printMsg(res.senderName, res.content, res.ts, res.senderStatus);
      }
    }
})

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket);
Notif.notifyAnnouncement(socket);
Notif.bindSessionWithFireReportTopic(socket);

socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username
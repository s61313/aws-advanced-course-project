import Msg from '../modules/msgModule.js';
import User from '../modules/userModule.js';
import Notification from '../modules/notificationModule.js';

var socket = io();

// for user login and logout, broadcast the updated online offline list to all users
socket.on("update userlist", (res) => {
    new User().getUserList();
});

// update the user status if user's status updates
socket.on("update status", (res) => {

    var status = res[0];
    var username = res[1];

    console.log(status, username);
    console.log(new User().updateStatusImage(status));
    //  change icon here
    $(`#${username}`).find('img:first').attr('src', new User().updateStatusImage(status));

});

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket);
Notif.notifyAnnouncement(socket);
Notif.bindSessionWithFireReportTopic(socket);


socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username

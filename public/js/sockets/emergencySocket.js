import Notification from '../modules/notificationModule.js';

var socket = io();

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket)


socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username
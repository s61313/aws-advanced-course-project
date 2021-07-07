import Shelter from '../modules/shelterModule.js';

import Notification from '../modules/notificationModule.js';

var socket = io();

socket.on("shelter", (res) => {
    console.log("shelter socket received");
    const partySize = sessionStorage.getItem("partySize");
    const petAccom = sessionStorage.getItem("petAccom");
    const disAccom = sessionStorage.getItem("disAccom");
    new Shelter().printAllShelter(partySize, petAccom, disAccom);
    // $.ajax({
    //     url: `/api/shelters/search`,
    //     type: "GET",
    //     data: {
    //         partySize: partySize,
    //         petAccom: petAccom,
    //         disAccom: disAccom
    //     },
    //     success: function (res) {
    //         const { data } = res;
    //         $("#shelter-list").empty();
    //         $.each(data, (index, shelterEntry) => {
    //             new Shelter().printShelter(shelterEntry.providername, shelterEntry.address, shelterEntry.residencetype, shelterEntry.occupancy, shelterEntry.petfriendly, shelterEntry.disfriendly, "search");
    //         });
    //     },
    // });
    // if (partySize <= res.occupancy && petAccom <= res.petfriendly && disAccom <= res.disfriendly) {
    //     console.log("printing new shelter");
    //     new Shelter().printShelter(res.providername, res.address, res.residencetype, res.occupancy, res.petfriendly, res.disfriendly, "search");
    // }

})

const Notif = new Notification();
Notif.bindSessionWithNotificationTopic(socket)
Notif.notifyAnnouncement(socket);


socket.emit('bindUserNameWithSocket', sessionStorage.getItem("username")); // ***add username
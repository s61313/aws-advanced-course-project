import Announcement from './modules/announcementModule.js';
const username = sessionStorage.getItem('username');

$(document).ready(() => {
    sessionStorage.removeItem("talkingToUsername");
    sessionStorage.removeItem("privateMsgUserJson");
    // when loading, get all message records
    $.ajax({
        url: "/api/announcement",
        type: "GET",
        success: function (res) {
            
            const {data} = res;
            $.each(data, (index, e)=>{
                new Announcement().printAnnouncement(e.sendername, e.content, e.ts);
            });

        },
    });

    //check privlege to load the form

});

// add new message
$("#btn-send").on("submit", (e) => {
    e.preventDefault();

    if($("#msg-txt").val() === "")
        return;
        
    const sendData = {
        username: username,
        content: $("#msg-txt").val(),

    };
        
    $.ajax({
        url: "/api/announcement",
        type: "POST",
        data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
    });

    $("#msg-txt").val("");
});





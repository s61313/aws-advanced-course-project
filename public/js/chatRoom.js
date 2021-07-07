import Msg from './modules/msgModule.js';
const username = sessionStorage.getItem('username');
const userstatus = sessionStorage.getItem('userstatus');



$(document).ready(() => {
    sessionStorage.removeItem("talkingToUsername");
    sessionStorage.removeItem("privateMsgUserJson");
    // when loading, get all message records
    $.ajax({
        url: "/api/messages/public",
        type: "GET",
        success: function (res) {
            
            const {data} = res;
            $.each(data, (index, e)=>{
                new Msg().printMsg(e.sendername, e.content, e.ts, e.senderstatus);
         
            });

        },
    });

});

// add new message
$("#btn-send").on("submit", (e) => {
    e.preventDefault();

    if($("#msg-txt").val() === "")
        return;
        
    const sendData = {
        username: username,
        content: $("#msg-txt").val(),
        status: userstatus,
        isOnline: true
    };
        
    $.ajax({
        url: "/api/messages/public",
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
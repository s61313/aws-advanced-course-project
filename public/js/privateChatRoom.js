import Msg from './modules/msgModule.js';
const username = sessionStorage.getItem('username');
const userStatus = sessionStorage.getItem('userStatus');
const talkingToUsername = sessionStorage.getItem('talkingToUsername');

$(document).ready(() => {
    sessionStorage.removeItem("privateMsgUserJson");
    // when loading, get all message records
    $.ajax({
        url: `/api/messages/private/${talkingToUsername}/${username}`,
        type: "GET",
        success: function (res) {
            const {data} = res;
            $.each(data, (index, privateMsg)=>{
                new Msg().printMsg(privateMsg.senderName, privateMsg.content, privateMsg.ts, privateMsg.senderStatus);
             
            });
            new Msg().updateUnreadToRead(talkingToUsername, username);

        },
    });    

});

// add new message
$("#btn-send").on("submit", (e) => {
    e.preventDefault();

    if($("#msg-txt").val() === "")
        return;
    //--------send new message to server------ TO DO---
    const sendData = {
        sendingUsername: username,
        senderStatus: sessionStorage.getItem("userstatus"), // "HELP", "OK"
        receivingUsername: talkingToUsername,
        content: $("#msg-txt").val()
    };

    console.log("sendData: " , sendData);
        
    $.ajax({
        url: "/api/messages/private/",
        type: "POST",
        data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log(res);
        },
    });
    //--------send new message to server------ TO DO---
    $("#msg-txt").val("");
});





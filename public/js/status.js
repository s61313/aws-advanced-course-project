const username = sessionStorage.getItem('username');
const userstatus = sessionStorage.getItem('userstatus');

// remember the last choosed status by reading session storage when loading the page
$(document).ready(() => {
    sessionStorage.removeItem("talkingToUsername");
    sessionStorage.removeItem("privateMsgUserJson");
    if(userstatus == "OK")
        $('#okRadio').prop('checked', true);
    else if(userstatus == "HELP")
        $('#helpRadio').prop('checked', true);
    else if(userstatus == "EMERGENCY")
        $('#emergencyRadio').prop('checked', true);
    else // undefined
        $('#okRadio').prop('checked', true);
});

// add new message
$("#send-status").on("submit", (e) => {
    e.preventDefault();

    //--------send new message to server------ TO DO---
    var userStatus;

    userStatus = setStatus(userStatus);

    const sendData = {
        username: username,
        status: userStatus
    };
    
    updateStatus(sendData);
    userStatus = numToText(userStatus);
    
    sessionStorage.setItem('userstatus', userStatus);
    window.location.href = window.location.origin + "/esnDir";

});

function setStatus (userStatus) {
    if($('#okRadio').is(':checked')){
        userStatus = '1';
        console.log(userStatus);
    }
    if ($('#helpRadio').is(':checked')) {
        userStatus = '2';
        console.log(userStatus);
    }
    if($('#emergencyRadio').is(':checked')){
        userStatus = '3';
        console.log(userStatus);
    }
    return userStatus;
}

function updateStatus(sendData){

    $.ajax({
        url: `api/users/${sendData.username}/status`,
        type: "POST",
        data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
    });
}

function numToText (userStatus) {
    if(userStatus === '1')
        userStatus = 'OK';
    else if(userStatus === '2')
        userStatus = 'HELP';
    else if(userStatus === '3')
        userStatus = 'EMERGENCY';
    return userStatus;
}
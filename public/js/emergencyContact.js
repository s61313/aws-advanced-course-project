import User from './modules/userModule.js';
const username = sessionStorage.getItem('username');
 
$(document).ready(function(){
    //append online usernames to emergency contact options
    new User().getUserListEmergencyContact();
});


// add new message
$("#emform").on("submit", (e) => {
    e.preventDefault();

    if($("#address").val() === "")
        return;

    const sendData = {
        Username: username,
        Phonenumber:$("#phone").val(),
        Address:  $("#address").val(),
        EmergencyContact:  $("#emergencycontactOption").val(),
    };

    console.log("sendData: " , sendData);
        
    $.ajax({
        url: "/api/emergency/contact/",
        type: "POST",
        data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log(res);
            //go back to previous page
            window.location.href = window.location.origin + "/esnDir";
            
        },
    });

   
});
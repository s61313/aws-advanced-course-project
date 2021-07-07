const username = sessionStorage.getItem('username');
var sum = 0;
$(document).ready(() => {
    sessionStorage.removeItem("talkingToUsername");
    sessionStorage.removeItem("privateMsgUserJson");
    const username = sessionStorage.getItem('username');
    getEmMsgList(username);

});

const okFunction = function () {
    sum -= 1;
    console.log("ok")
    $(this).closest(".list-group-item").remove();
    var requestedBy = $(this).closest('div').find('#name').text();
    const sendData = {
        requestusername: requestedBy,
        username: username,
    };
    $.ajax({
        url: "/api/emergency/contact/acknowledge/",
        type: "PUT",
        data: sendData,
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
    });
    if (sum === 0) {
        $("#emergencyContact-btn").attr('style', 'color:white');
    }

}
const acceptFunction = function () {
    sum -= 1;
    console.log("accept")
    $(this).closest(".list-group-item").remove();
    var requestedBy = $(this).closest('div').find('#name').text();
    const sendData = {
        requestusername: requestedBy,
        username: username,
    };

    $.ajax({
        url: "/api/emergency/contact/accept/",
        type: "PUT",
        data: sendData,
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
    });
    if (sum === 0) {
        $("#emergencyContact-btn").attr('style', 'color:white');
    }

}
const declineFunction = function () {
    sum -= 1;
    console.log("decline")
    $(this).closest(".list-group-item").remove();
    var requestedBy = $(this).closest('div').find('#name').text();
    const sendData = {
        requestusername: requestedBy,
        username: username,
    };
    $.ajax({
        url: "/api/emergency/contact/decline/",
        type: "PUT",
        data: sendData,
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
    });
    if (sum === 0) {
        $("#emergencyContact-btn").attr('style', 'color:white');
    }
}


const getEmMsgList = function (username) {
    $.ajax({
        url: "/api/emergency/contact/" + username,
        type: "GET",
        dataType: "json",
        success: function (res) {
            //add each user to html

            $.each(res.data, (index, user) => {
                var printRequest;
                sum += 1;
                if (user.emergencycontactstatus == 0) {
                    printRequest = '<div class="list-group-item">' +
                        '<div class="align-items-start" style="overflow: hidden;">' +
                        '<div class="flex-grow-1 ml-3">' + '<strong id="name">' + user.username + '</strong>' + ' wants you to be his/her emergenct contact.' + ' </div>' +
                        '<input type="submit" class="btn-request-d" name="decline"  id="decline" value="Decline">' +
                        '<input type="submit" class="btn-request-a" name="accept"  id="accept" value="Accept">' +
                        '</div>' +
                        '</div>';
                } else if (user.emergencycontactstatus == 2) {
                    printRequest = '<div class="list-group-item">' +
                        '<div class="align-items-start" style="overflow: hidden;">' +
                        '<div class="flex-grow-1 ml-3">' + '<strong id="name">' + user.username + '</strong>' + ' chooses to notify you that he/she is having an emergency. ' +
                        '<strong>' + user.username + '</strong>' + '’s address is ' + '<strong>' + user.address + '</strong>' + ' and can be reached at ' + '<strong>' + user.phonenumber + '</strong>' + '</div>' +
                        '<input type="submit" class="btn-request-o" name="ok" id="ok" value="OK">' +
                        '</div>' +
                        '</div>';

                }

                $("#private-chat-user-list").append(printRequest);

            });
            $('.btn-request-o').on('click', okFunction);
            $('.btn-request-a').on('click', acceptFunction);
            $('.btn-request-d').on('click', declineFunction);
        },
    });
}




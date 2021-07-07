// append new msg/msg record to content-list
export default class Msg {
    constructor() {

    }

    static getMsgLeftView(sendername, userstatus, content, postTime) {
        return '<div class="chat-left">' +
                    '<div class="chat-icon">' +
                        '<a class="avatar" data-placement="left">' +
                            '<img src="icon.jpg" alt="Avatar" class="avatar">' +
                        '</a>' +
                    '</div>' 
                    +
                    Msg.getMsgBodyView(sendername, userstatus, content, postTime)
                    +
                '</div>';
    }

    static getMsgRightView(sendername, userstatus, content, postTime) {
        return '<div class="chat">' +
        '<div class="chat-icon">' +
        '<a class="avatar" data-placement="right">' +
        '<img src="icon.jpg" alt="Avatar" class="avatar">' +
        '</a>' +
        '</div>' 
        +
        Msg.getMsgBodyView(sendername, userstatus, content, postTime)
        +
        '</div>';
    }

    static getMsgBodyView(sendername, userstatus, content, postTime) {
        return '<div class="chat-body">' +
        '<div class="chat-content">' +
        '<div class="chat-user">' + sendername + "  " + "[" + userstatus + "]" + '</div>' +
        '<div class="user-msg">' +
        '<span>' + content + '</span>' +
        '</div>' +
        '<time class="chat-time" datetime="2015-07-01T11:39">' + postTime + '</time>' +
        '</div>' +
        '</div>';
    }

    printMsg(sendername, content, time, userstatus) {

        var postTime = new Date(time);
        var msg;
        const username = sessionStorage.getItem("username");

        if (!userstatus)
            userstatus = 'NOT SET';

        if (sendername === username) { // own message ====> TO-DO Ted == username
            msg = Msg.getMsgRightView(sendername, userstatus, content, postTime);
        } else { // message is from others
            msg = Msg.getMsgLeftView(sendername, userstatus, content, postTime);
        }

        $(".chat-window").append(msg);
        $(".chat-window").scrollTop($(".chat-window")[0].scrollHeight); // always keep the mesage content to the bottom
    }

    updateUnreadToRead(talkingToUsername, username) {
        console.log("updateUnreadToRead called");
        $.ajax({
            url: `/api/messages/private/${talkingToUsername}/${username}`,
            type: "PUT",
            success: function (res) {
                checkUnreadmsgForInboxBtn(username);
            },
        });
    }
}


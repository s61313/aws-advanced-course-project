// append new msg/msg record to content-list
export default class Announcement {
    constructor() {

    }

    static getAnnouncementView(sendername, content, postTime) {
        return '<div class="chat-left">' +
                    '<div class="chat-icon">' +
                        '<a class="avatar" data-placement="left">' +
                            '<img src="icon.jpg" alt="Avatar" class="avatar">' +
                        '</a>' +
                    '</div>' 
                    +
                    Announcement.getAnnouncementBodyView(sendername, content, postTime)
                    +
                '</div>';
    }


    static getAnnouncementBodyView(sendername,content, postTime) {
        return '<div class="chat-body">' +
        '<div class="chat-content">' +
        '<div class="chat-user">' + sendername + "  " + '</div>' +
        '<div class="user-msg">' +
        '<span>' + content + '</span>' +
        '</div>' +
        '<time class="chat-time" datetime="2015-07-01T11:39">' + postTime + '</time>' +
        '</div>' +
        '</div>';
    }

    printAnnouncement(sendername, content, time) {

        var postTime = new Date(time);
        var announcement;
        const username = sessionStorage.getItem("username");
        //TODO: if user privilege != coordinator, display warning (backend check)

        //if (user.priviliege === "Coordinator")
            announcement = Announcement.getAnnouncementView(sendername,content, postTime);
        //else display warning

        $(".chat-window").append(announcement);
        $(".chat-window").scrollTop($(".chat-window")[0].scrollHeight); // always keep the mesage content to the bottom
    }

 
}


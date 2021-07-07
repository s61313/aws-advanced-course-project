const privateChatUserList = $("#private-chat-user-list");
$(document).ready(() => {
    sessionStorage.removeItem("talkingToUsername");
    sessionStorage.removeItem("privateMsgUserJson");
    const username = sessionStorage.getItem('username');
    getPrivateChatUserList(username);
});

const getPrivateChatUserList = function(username) {
    $.ajax({
    url: "/api/users/" + username + "/private",
    type: "GET",
    dataType: "json",
    success: function (res) {
      //add each user to html

      const privateMsgUserJson = {};

      $.each(res.data, (index, user) => {   

        privateMsgUserJson[user.username] = "exist";

        var userCard;
        if (user.count > 0) {
            userCard = `<div class="list-group-item" onclick="goToPrivateChatroomFromInbox('${user.username}')">
                <div class="d-flex align-items-start">
                    <div class="flex-grow-1 ml-3"> ${user.username}</div>
                    <span style="font-size: 10px; color: red; padding-top: 5px;">
                        <em class="fas fa-circle"></em>
                    </span>                      
                </div>
            </div>`;
        }else {
            userCard = `<div class="list-group-item" onclick="goToPrivateChatroomFromInbox('${user.username}')">
                <div class="d-flex align-items-start">
                    <div class="flex-grow-1 ml-3"> ${user.username}</div>
                    <div id="${user.username}-chat">
                    </div>
                </div>    
            </div>`;
        }

        privateChatUserList.append(userCard);
      });

      sessionStorage.setItem("privateMsgUserJson", JSON.stringify(privateMsgUserJson));
    },
  });
}

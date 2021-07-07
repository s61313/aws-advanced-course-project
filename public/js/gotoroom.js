
function goToPrivateChatroom(talkingToUsername) {
    const owner = sessionStorage.getItem('username');
    sessionStorage.setItem("talkingToUsername", talkingToUsername);
    if (talkingToUsername !== owner) {
      window.location.href = window.location.origin + "/privateChatroom";
    }
}

function goToPrivateChatroomFromInbox(talkingToUsername) {
    sessionStorage.setItem("talkingToUsername", talkingToUsername);
    window.location.href = window.location.origin + "/privateChatroom";
}
export default class User{

    getUserList() {
        $.ajax({
        url: "/api/users",
        type: "GET",
        dataType: "json",
        success: function (res) {
          console.log(res);
    

          const owner = sessionStorage.getItem("username");
          // if there is a userlist, clean it
          if($("#user-list").find(".list-group-item"))
          {
            $("#user-list").empty();
          }
    
          //add each user to html
          $.each(res.data, (index, user) => {
            const username = user.username;      
            const onlineStatus = user.isonline == 1 ? "online" : "offline";
            const userstatus = user.status;   
    
            const img = new User().updateStatusImage(userstatus);
            var onOffColor = (onlineStatus === "online") ? `<div class="small" style="color:green;font-weight:bold;">${onlineStatus}</div>` : `<div class="small" style="color:gray;font-weight:bold;">${onlineStatus}</div>`
            var ownerBkColor = (username === owner) ? 'style="background-color: #FFF6D9;"' : '';
            const userCard = 
              `<div class="list-group-item" ${ownerBkColor} id=${username}>
              <div class="d-flex align-items-start">
                <img src=${img} class="rounded-circle mr-1" width="40" height="40">
                <div class="flex-grow-1 ml-3">${username} ${onOffColor} </div>
                <img src='/assets/chat.png' mr-1" width="30" height="30" onclick="goToPrivateChatroom('${username}')">
              </div>
            </div>`;
            $("#user-list").append(userCard);
          });
        },
      });
    }

    updateStatusImage(status) {
        if(!status){
          return "/assets/offline.png";
        }
        if (status === "1") { // OK
          return "/assets/ok.png";
        }
        if (status === "2") { // HELP
          return "/assets/help.png";
        }
        if (status === "3") { // EMERGENCY
          return "/assets/emergency.png";
        }
    }


    getUserListEmergencyContact() {
      $.ajax({
      url: "/api/users",
      type: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res);
  

        const owner = sessionStorage.getItem("username");
        const emergencyContact = $("#emergencycontactOption");

        

    
        //add each user to html
        $.each(res.data, (index, user) => {
          const username = user.username; 
          if(username !== owner && user.isonline == 1){
            const userCard = username;
            $("<option/>", {text: userCard}).appendTo(emergencyContact);
          }
          
        });
        
        
        
      },
    });
  }

}
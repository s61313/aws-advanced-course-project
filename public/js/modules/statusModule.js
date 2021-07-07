export default class Status{

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

    

}
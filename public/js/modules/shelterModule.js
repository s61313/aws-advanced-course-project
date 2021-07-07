// append compatible shelters to content-list
export default class Shelter {
    constructor() {

    }

    static getShelterView(providername, address, residencetype, occupancy, petfriendly, disfriendly, flow) {
        var pet = petfriendly === 1 ? "Pet-friendly" : "";
        var disability = disfriendly === 1 ? "Disability-friendly" : "";
        var chatIcon = flow === "search" ? `<img src="/assets/chat.png" mr-1" width="32" height="32" onclick="goToPrivateChatroom('${providername}')">` : "";
        occupancy = occupancy === 3 ? "3+" : occupancy;
        var shelterIcon = Shelter.getShelterIcon(residencetype);
        return `<div class="list-group-item" id=${providername}>
        <div class="d-flex align-items-start">
          <img src=${shelterIcon} width="40" height="40">
          <div class="flex-grow-1 ml-3">${providername}<div class="small">Max Occupancy: ${occupancy}</br>${pet} </br> ${disability}</div></div> 
          <div class="flex-grow-1 ml-3">${residencetype} - ${address}</div>
          ${chatIcon}
        </div></div>`;
    }

    static getShelterIcon(residencetype) {
        if (residencetype==="House") {
            return "/assets/house.png";
        } else if (residencetype==="Apartment") {
            return "/assets/apartment.png";
        } else {
            return "/assets/unknown.png";
        }
    }

    printShelter(providername, address, residencetype, occupancy, petfriendly, disfriendly, flow) {
        var shelter;
        shelter = Shelter.getShelterView(providername, address, residencetype, occupancy, petfriendly, disfriendly, flow);
        $("#shelter-list").append(shelter);
    }

    printAllShelter(partySize, petAccom, disAccom) {
        $.ajax({
            url: `/api/shelters/search`,
            type: "GET",
            data: {
                partySize: partySize,
                petAccom: petAccom,
                disAccom: disAccom
            },
            success: function (res) {
                const { data } = res;
                $("#shelter-list").empty();
                $.each(data, (index, shelterEntry) => {
                    new Shelter().printShelter(shelterEntry.providername, shelterEntry.address, shelterEntry.residencetype, shelterEntry.occupancy, shelterEntry.petfriendly, shelterEntry.disfriendly, "search");
                });
            },
        });
    }

}


$(document).ready(() => {
    sessionStorage.removeItem("partySize");
    sessionStorage.removeItem("petAccom");
    sessionStorage.removeItem("disAccom");
});

$("#send-seeker-info").on("submit", (e) => {
    e.preventDefault();
    //check for existing entry: if so, redisplay page with error

    var partySize;
    partySize = setOccupancy(partySize);

    var petAccom = 0;
    petAccom = setPetAccom(petAccom);

    var disAccom = 0;
    disAccom = setDisAccom(disAccom);

    // const sendData = {
    //     providername: username,
    //     address: address,
    //     residenceType: residenceType,
    //     occupancy: occupancy,
    //     petFriendly: isPetFriendly,
    //     disFriendly: isDisFriendly
    // };

    //call POST /api/shelters/creation with the selected parameters
    // findShelterEntries(sendData);
    sessionStorage.setItem('partySize', partySize);
    sessionStorage.setItem('petAccom', petAccom);
    sessionStorage.setItem('disAccom', disAccom);
    window.location.href = window.location.origin + "/shelters/search/compatibleShelters";

});

function setOccupancy(partySize) {
    if ($('#unselected').is(':checked')) {
        partySize = 0;
        console.log(partySize);
    }
    if ($('#one').is(':checked')) {
        partySize = 1;
        console.log(partySize);
    }
    if ($('#two').is(':checked')) {
        partySize = 2;
        console.log(partySize);
    }
    if ($('#three').is(':checked')) {
        partySize = 3;
        console.log(partySize);
    }
    return partySize;
}

function setPetAccom(petAccom) {
    if ($('#pet').is(':checked')) {
        petAccom = 1;
    }
    console.log(petAccom);
    return petAccom;
}

function setDisAccom(disAccom) {
    if ($('#disability').is(':checked')) {
        disAccom = 1;
    }
    console.log(disAccom);
    return disAccom;
}

// function findShelterEntries(sendData) {
//     console.log("shelter frontend called");
//     $.ajax({
//         url: `/api/shelters/search`,
//         type: "GET",
//         data: sendData,
//         dataType: "json",
//         success: function (
//             res // get return message from server
//         ) {
//         },
//     });
// }
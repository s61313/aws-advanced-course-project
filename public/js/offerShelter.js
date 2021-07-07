const providername = sessionStorage.getItem('username');
const hasActiveEntry = sessionStorage.getItem('hasActiveShelterEntry');
$("#send-shelter-info").on("submit", (e) => {
    e.preventDefault();
    var address = $("#address").val();
    //check for existing entry: if so, redisplay page with error
    if (hasActiveEntry === "true") {
        $('#errorModal').modal('show');
    } else if (address === "") {
        $('#addressModal').modal('show');
    } else {
        //set the sendData fields according to selections
        var residenceType;
        residenceType = setResType(residenceType);

        var occupancy;
        occupancy = setOccupancy(occupancy);

        var petFriendly = 0;
        petFriendly = setPetAccom(petFriendly);

        var disFriendly = 0;
        disFriendly = setDisAccom(disFriendly);

        const sendData = { providername, address, residenceType, occupancy, petFriendly, disFriendly };

        //call POST /api/shelters/creation with the selected parameters
        createShelterEntry(sendData);

        //update session storage to indicate active entry and redirect to confirmation
        sessionStorage.setItem('hasActiveShelterEntry', true);
        window.location.href = window.location.origin + "/shelters/creation/confirmation";
    }
});

//todo: implement setters for the parameters

function setResType(residenceType) {
    if ($('#house').is(':checked')) {
        residenceType = 'House';
        console.log(residenceType);
    }
    if ($('#apartment').is(':checked')) {
        residenceType = 'Apartment';
        console.log(residenceType);
    }
    if ($('#other').is(':checked')) {
        residenceType = 'Other';
        console.log(residenceType);
    }
    return residenceType;
}

function setOccupancy(occupancy) {
    if ($('#one').is(':checked')) {
        occupancy = 1;
        console.log(occupancy);
    }
    if ($('#two').is(':checked')) {
        occupancy = 2;
        console.log(occupancy);
    }
    if ($('#three').is(':checked')) {
        occupancy = 3;
        console.log(occupancy);
    }
    return occupancy;
}

function setPetAccom(petFriendly) {
    if ($('#pet').is(':checked')) {
        petFriendly = 1;
    }
    console.log(petFriendly);
    return petFriendly;
}

function setDisAccom(disFriendly) {
    if ($('#disability').is(':checked')) {
        disFriendly = 1;
    }
    console.log(disFriendly);
    return disFriendly;
}

function createShelterEntry(sendData) {
    console.log("shelter frontend called");
    $.ajax({
        url: `/api/shelters`,
        type: "POST",
        data: sendData,
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
        },
    });
}
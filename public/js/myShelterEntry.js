import Shelter from './modules/shelterModule.js';
const providername = sessionStorage.getItem("username");
const hasActiveEntry = sessionStorage.getItem("hasActiveShelterEntry");

$(document).ready(() => {

    //if session storage doesn't have active entry=>should be empty, hide button
    if (hasActiveEntry==="false") {
       $("#modal-button-delete").hide();
    }
    $.ajax({
        url: `/api/shelters`,
        type: "GET",
        data: {
            providername: providername
        },
        success: function (res) {
            const { data } = res;
            $("#shelter-list").empty();
            $.each(data, (index, shelterEntry) => {
                new Shelter().printShelter(shelterEntry.providername, shelterEntry.address, shelterEntry.residencetype, shelterEntry.occupancy, shelterEntry.petfriendly, shelterEntry.disfriendly, "creation");
            });
        },
    });

});


$("#confirm-delete").click((e) => {
    e.preventDefault();
    // $("#search-more-btn").hide();

    $.ajax({
        url: `/api/shelters`,
        type: "DELETE",
        data: {
            providername: providername
        },
        success: function (res) {
        },
    });


    sessionStorage.setItem('hasActiveShelterEntry', false);
    window.location.href = window.location.origin + "/shelters/creation/entries";
});

// function deleteMyEntry(providername) {
//     const owner = sessionStorage.getItem('username');
//     sessionStorage.setItem("talkingToUsername", talkingToUsername);
//     if (talkingToUsername !== owner) {
//       window.location.href = window.location.origin + "/privateChatroom";
//     }
// }
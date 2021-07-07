import Shelter from './modules/shelterModule.js';
const partySize = sessionStorage.getItem("partySize");
const petAccom = sessionStorage.getItem("petAccom");
const disAccom = sessionStorage.getItem("disAccom");

$(document).ready(() => {
    //when loading, use the filters stored in sessionStorage to get compatible entries
    //then render the compatible entries
    new Shelter().printAllShelter(partySize, petAccom, disAccom);
    // $.ajax({
    //     url: `/api/shelters/search`,
    //     type: "GET",
    //     data: {
    //         partySize: partySize,
    //         petAccom: petAccom,
    //         disAccom: disAccom
    //     },
    //     success: function (res) {
    //         const { data } = res;
    //         $("#shelter-list").empty();
    //         $.each(data, (index, shelterEntry) => {
    //             new Shelter().printShelter(shelterEntry.providername, shelterEntry.address, shelterEntry.residencetype, shelterEntry.occupancy, shelterEntry.petfriendly, shelterEntry.disfriendly, "search");
    //         });
    //     },
    // });

});
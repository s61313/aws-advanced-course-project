const SocketioService = require("../utils/socketio");
const ShelterModel = require("../models/shelterModel");
const HttpResponse = require("./httpResponse.js");

//TODO: Change function parameters

async function createShelter(providername, address, residenceType, occupancy, petFriendly, disFriendly) {

    // step01: store msg in db
    const resMsg = await ShelterModel
        .create(providername, address, residenceType, occupancy, petFriendly, disFriendly)
        .then((dbResult) => {
            console.log("shelterentries table updated row: " + dbResult.affectedRows);
            console.log("shelterentries table inserted at id: " + dbResult.insertId);
            return new HttpResponse("Shelter is created.", "createShelterSuccess", "false", { insertId: dbResult.insertId });
        })
        .catch((err) => {
            return new HttpResponse(
                "Error creating shelter.",
                "createShelterFailed",
                "true",
                err
            );
        });

    // const insertId = resMsg.data.insertId;

    // // step02: get the newly-created Msg from db (for its timestamp value)
    // const shelterForPush = await ShelterModel.findShelter(insertId);

    // step03: push msg to online users 
    await SocketioService.getInstance().pushShelter("shelter"); //define pushShelter in utils/socketio.js

    return resMsg;
}

async function getShelters(partySize, petAccom, disAccom) {
    // console.log(`getAnnouncements ${keywords}`);
    var resMsg;

    resMsg = await findCompatibleSheltersHelper(partySize, petAccom, disAccom);
    console.log(`searching by party size ${partySize}, pet accomodation ${petAccom}, disability accomodation ${disAccom}`);

    return resMsg;
}

async function getOwnShelter(providername) {
    // console.log(`getAnnouncements ${keywords}`);
    var resMsg;

    resMsg = await findOwnShelterHelper(providername);
    console.log(`searching by own username ${providername}`);

    return resMsg;
}

async function deleteOwnShelter(providername) {
     // console.log(`getAnnouncements ${keywords}`);
     var resMsg;

     resMsg = await deleteOwnShelterHelper(providername);
     console.log(`deleting by own username ${providername}`);
     await SocketioService.getInstance().pushShelter("shelter");
     return resMsg;
}

function findCompatibleSheltersHelper(partySize, petAccom, disAccom) {
    return ShelterModel.findCompatibleShelters(partySize, petAccom, disAccom)
        .then((dbResult) => {
            return new HttpResponse("found compatible shelters.", "sheltersFound", "false", dbResult);
        })
}

function findOwnShelterHelper(providername) {
    return ShelterModel.findOwnShelter(providername)
        .then((dbResult) => {
            return new HttpResponse("found own shelter.", "shelterFound", "false", dbResult);
        })
}

function deleteOwnShelterHelper(providername) {
    return ShelterModel.delOwnShelter(providername)
        .then((dbResult) => {
            return new HttpResponse("deleted own shelter.", "shelterDeleted", "false", dbResult);
        })
}

module.exports = {
    createShelter: createShelter,
    getShelters: getShelters,
    getOwnShelter: getOwnShelter,
    deleteOwnShelter: deleteOwnShelter

};

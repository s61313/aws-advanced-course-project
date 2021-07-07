const shelterModel = require("../models/shelterModel");

var app = require('../main.js');
jest.setTimeout(30000);

var entryid;

beforeAll(async () => {
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("INSERT INTO shelterentries (providername, address, residencetype, occupancy, petfriendly, disfriendly) VALUES (\"dahan\", \"add1\", \"House\", 3, 1, 1)");
    await app.db.getConnection().awaitQuery("INSERT INTO shelterentries (providername, address, residencetype, occupancy, petfriendly, disfriendly) VALUES (\"nahad\", \"add2\", \"Apartment\", 2, 0, 0)");
    await app.db.getConnection().awaitQuery("INSERT INTO shelterentries (providername, address, residencetype, occupancy, petfriendly, disfriendly) VALUES (\"andy\", \"add3\", \"Other\", 1, 0, 1)");
    await app.db.getConnection().awaitQuery("INSERT INTO shelterentries (providername, address, residencetype, occupancy, petfriendly, disfriendly) VALUES (\"ted\", \"add4\", \"House\", 3, 1, 0)");
});

afterAll(async () => {
    await app.db.getConnection().awaitQuery("TRUNCATE shelterentries");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }
});



describe('Find all compatible shelters given arbitrary partysize and accomodations', () => {
    test('find all compatible shelters', async () => {
        const partySize = 2;
        const petAccom = 1;
        const disAccom = 1;
        return await shelterModel.findCompatibleShelters(partySize, petAccom, disAccom).then((dbResp) => {
            expect(dbResp[0].address).toBe("add1");
        });
    });
});

// describe('Find shelter with db id', () => {
//     test('find shelter by id', async () => {
//         return await shelterModel.findShelter(entryid).then((dbResp) => {
//             expect(dbResp[0].address).toBe("add1");
//         });
//     });
// });

describe('Find own shelter by searching with own username', () => {
    test('find own shelter', async () => {
        const providername = "andy";
        return await shelterModel.findOwnShelter(providername).then((dbResp) => {
            expect(dbResp[0].address).toBe("add3");
        });
    });
});

describe('Delete own shelter by filtering with own username', () => {
    test('delete own shelter', async () => {
        const providername = "andy";
        return await shelterModel.delOwnShelter(providername).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});

describe('create shelter, database should be updated by 1 row ', () => {
    test('create shelter', async () => {
           const providername= "dahan2"; 
           const address= "123 example"; 
           const residenceType= "House"; 
           const occupancy= 2; 
           const petFriendly= 1; 
           const disFriendly= 1;
        return await shelterModel.create(providername, address, residenceType, occupancy, petFriendly, disFriendly).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});


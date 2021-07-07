
let agent = require('superagent');
const Em = require("../models/emergencyContactModel");
var app = require('../main.js');
jest.setTimeout(30000);

beforeAll(async () => {
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("TRUNCATE emergencycontact");

});

afterAll(async () => {
    await app.db.getConnection().awaitQuery("TRUNCATE emergencycontact");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }
});



describe('set up emergency contact should insert a new row to emergencycontact table', () => {
    test('Setting up emergency contact', async () => {
        const username = "dahan";
        const phonenumber = "777-666-7777";
        const address = "at home";
        const emergencycontact = "Oreo";

        return await Em.create(username, phonenumber, address, emergencycontact).then((dbResp) => {
            expect(dbResp[0].affectedRows).toBe(1);
        });
    });

    test('verify the inserted row fields', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontact).toBe('Oreo');
        });
    });

})


describe('when oreo accepts request from dahan,the emergencycontact status of dahan will be updated to 1', () => {
    test('accept emergency contact request', async () => {
        const username = "Oreo";
        const requestusername = "dahan";

        return await Em.accept(requestusername, username).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });

    test('verify the inserted row fields', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontactstatus).toBe("1");
        });
    });

})


describe('when oreo denies the request from dahan, the emergencycontact status should be updated to 3', () => {
    test('deny request', async () => {
        const requestusername = "dahan";
        const username = "oreo";

        return await Em.deny(requestusername,username).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
    test('verify the inserted row fields', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontactstatus).toBe("3");
        });
    });

})

describe('when oreo receives alert from dahan and acknowledges it, the emergencycontactstatus will be changed to 4', () => {
    test('deny request', async () => {
        const requestusername = "dahan";
        const username = "oreo";

        return await Em.acknowledge(requestusername,username).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
    test('verify the inserted row fields', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontactstatus).toBe("4");
        });
    });

})

describe('find emergency contact by username', () => {

    test('find emergency contact', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontact).toBe("Oreo");
        });
    });

})


describe('Get the emergency button status by username', () => {

    test('get button status', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontactstatus).toBe("4");
        });
    });

})

describe('when dahan press the button, the emergencycontact status should be updated to 2', () => {
    test('alert emergency contact', async () => {
        const username = "dahan";

        return await Em.alert(username).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
    test('verify the inserted row fields', async () => {
        const username = "dahan";

        return await Em.findEmergencyContactByUsername(username).then((dbResp) => {
            expect(dbResp[0].emergencycontactstatus).toBe("2");
        });
    });

})

describe('Find users that has pending requests', () => {

    test('find user with pending request', async () => {
        const username = "Oreo";

        return await Em.findUserWithPendingEMRequest(username).then((dbResp) => {
            expect(dbResp[0].username).toBe("dahan");
        });
    });

})
















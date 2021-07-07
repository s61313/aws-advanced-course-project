let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
    await app.server.listen(PORT);
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    await app.db.getConnection().awaitQuery("TRUNCATE emergencycontact");
    const res = await agent
        .post(HOST + "/api/users")
        .send({ username: "apiuser001", password: "1234" });
    token = res.body.data.token;
});

afterAll(async () => {
    //pass a callback to tell jest it is async
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }
});


describe("POST create emergency contact API ", () => {
    test(`test if the emergency contact can be created`, (done) => {
        const data = {
            Username: "apiuser001",
            Phonenumber: "111-111-1111",
            Address: "at home",
            EmergencyContact: "apple",
        };
        agent
            .post(HOST + `/api/emergency/contact`)
            .auth(`${token}`, { type: "bearer" })
            .send(data)
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.resCode).toBe("emergenctContactCreated");
                done();
            });
    });
});


describe("GET find the pending requests of current user ", () => {
    test(`test if the emergency contact can be created`, (done) => {
        const data = {
            Username: "dahan",
            Phonenumber: "111-111-1111",
            Address: "at home",
            EmergencyContact: "apple",
        };
        agent
            .post(HOST + `/api/emergency/contact`)
            .auth(`${token}`, { type: "bearer" })
            .send(data)
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.resCode).toBe("emergenctContactCreated");
                done();
            });
    });

    test(`find all the requests received by current user`, (done) => {
        var username = 'apple';
        agent
            .get(HOST + `/api/emergency/contact/` + username)
            .auth(`${token}`, { type: "bearer" })
            .send()
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.data[0].username).toBe("apiuser001");
                expect(res.body.data[1].username).toBe("dahan");
                done();
            });
    });
});

describe("PUT accept emergency contact API ", () => {
    test(`test if emergency contact request can be accepted`, (done) => {
        const data = {
            requestusername: 'dahan',
            username : 'apple',
        };
        agent
            .put(HOST + `/api/emergency/contact/accept`)
            .auth(`${token}`, { type: "bearer" })
            .send(data)
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.resCode).toBe("emergenctContactConfirmed");
                done();
            });
    });
    //check whether emergency contact status is updated to 1
    test(`confirm the emergency contactstatus value after accepting request`, (done) => {
        var username = 'dahan';
        agent
            .get(HOST + `/api/emergency/alert/` + username)
            .auth(`${token}`, { type: "bearer" })
            .send()
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.data[0].emergencycontactstatus).toBe("1");
                done();
            });
    });
});


describe("PUT acknowledge emergency contact API ", () => {
    test(`test if emergency contact alert can be acknowledged`, (done) => {
        const data = {
            requestusername: 'dahan',
            username : 'apple',
        };
        agent
            .put(HOST + `/api/emergency/contact/acknowledge`)
            .auth(`${token}`, { type: "bearer" })
            .send(data)
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.resCode).toBe("emergenctAlertNoted");
                done();
            });
    });
    //check whether emergency contact status is updated to 3
    test(`confirm the emergency contactstatus value after declining request`, (done) => {
        var username = 'dahan';
        agent
            .get(HOST + `/api/emergency/alert/` + username)
            .auth(`${token}`, { type: "bearer" })
            .send()
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.data[0].emergencycontactstatus).toBe("4");
                done();
            });
    });
});

describe("PUT decline emergency contact API ", () => {
    test(`test if emergency contact request can be declined`, (done) => {
        const data = {
            requestusername: 'dahan',
            username : 'apple',
        };
        agent
            .put(HOST + `/api/emergency/contact/decline`)
            .auth(`${token}`, { type: "bearer" })
            .send(data)
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.resCode).toBe("emergenctContactDeclined");
                done();
            });
    });
    //check whether emergency contact status is updated to 3
    test(`confirm the emergency contactstatus value after declining request`, (done) => {
        var username = 'dahan';
        agent
            .get(HOST + `/api/emergency/alert/` + username)
            .auth(`${token}`, { type: "bearer" })
            .send()
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.data[0].emergencycontactstatus).toBe("3");
                done();
            });
    });
});

describe("PUT alert emergency contact API ", () => {
    test(`test if emergency contact can be alert`, (done) => {
        const data = {
            username : 'dahan',
        };
        agent
            .put(HOST + `/api/emergency/contact/alert`)
            .auth(`${token}`, { type: "bearer" })
            .send(data)
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.resCode).toBe("alerted");
                done();
            });
    });
    //check whether emergency contact status is updated to 3
    test(`confirm the emergency contactstatus value after alerting`, (done) => {
        var username = 'dahan';
        agent
            .get(HOST + `/api/emergency/alert/` + username)
            .auth(`${token}`, { type: "bearer" })
            .send()
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.statusCode).toBe(200);
                expect(res.body.data[0].emergencycontactstatus).toBe("2");
                done();
            });
    });
});



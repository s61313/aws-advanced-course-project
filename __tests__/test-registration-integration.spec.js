let agent = require('superagent');
var app = require('../main.js');

jest.setTimeout(60000);

let PORT = 8080;
let HOST = 'http://localhost:' + PORT;

var token;

beforeAll(async () => {
    await app.server.listen(PORT);
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    const res = await agent.post(HOST + "/api/users").send({ "username": "apiuser001", "password": "1234" });
    token = res.body.data.token;
});

afterAll(async () => { //pass a callback to tell jest it is async
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }
})


describe('registration api test ', () => {
    test('should add a new user', (done) => {
        agent.post(HOST + '/api/users')
            .send({ "username": "dahan", "password": "1234" })
            .end(function (err, res) {
                expect(err).toBe(null);
                expect(res.body.resMsg).toBe("User is created.");
                done();

            });
    });
});


describe('logout api test ', () => {
    test('should update user isonline to false', (done) => {
        const username = 'apiuser001';
        agent.put(HOST + '/api/users/' + username + '/offline')
            .send()
            .set('Authorization', token)
            .end(function (err, res) {
                expect(res.body.resCode).toBe("socketRemoved");
                done();
            });
    });
});




describe('login api test ', () => {
    test('login with correct password', (done) => {
        const username = 'apiuser001';
        agent.put(HOST + '/api/users/' + username + '/online')
            .send({ "username": "apiuser001", "password": "1234" })
            .end(function (err, res) {
                expect(res.body.resCode).toBe("loginSuccessful");
                done();
            });
    });
});


describe('login api test ', () => {
    test('login with wrong password', (done) => {
        const username = 'apiuser001';
        agent.put(HOST + '/api/users/' + username + '/online')
            .send({ "username": "apiuser001", "password": "4321" })
            .end(function (err, res) {
                expect(res.body.resCode).toBe("passwordIncorrect");
                done();
            });
    });
});

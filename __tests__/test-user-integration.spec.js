let agent = require('superagent');
var app = require('../main.js');

jest.setTimeout(10000);

let PORT = 8080;
let HOST = 'http://localhost:' + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  const res = await agent.post(HOST + "/api/users").send({"username": "apiuser001", "password": "1234"});
  token = res.body.data.token; 
});

afterAll(async() => { //pass a callback to tell jest it is async
  if (app.server.listening) {
    await app.db.endConnection();
    await app.server.close();
  }
})

describe('user Router tests ', () => {
  test('get user by user name', (done) => {
    var username = "dahan";
    agent.get(HOST + `/api/users/${username}`)
      .send()
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe("userSearchOk");
        done();
      });
    });
});

describe('user Router tests ', () => {
    test('get all users', (done) => {
      agent.get(HOST + '/api/users')
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.body.resCode).toBe("userQueried");
          done();
        });
      });
  });



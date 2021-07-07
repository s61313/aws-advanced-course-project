let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE announcement");
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  const res = await agent
    .post(HOST + "/api/users")
    .send({"username": "apiuser001", "password": "1234"});
  token = res.body.data.token; 
});

afterAll(async() => { //pass a callback to tell jest it is async
  await app.db.getConnection().awaitQuery("TRUNCATE announcement");
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  if (app.server.listening) {
      await app.db.endConnection();
      await app.server.close();
    }
  });

describe('Announcement Router get tests ', () => {
    test('get Announcement', (done) => {
      agent.get(HOST + `/api/announcement`)
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          done();
        });
      });
  });

describe('Announcement Router post tests ', () => {
    test('get Announcement', (done) => {
      agent.post(HOST + `/api/announcement`)
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          done();
        });
      });
  });

  describe("POST announcement API ", () => {
    test(`test if  announcement can be created`, (done) => {
      const data = {
        content: "create announcement",
        username: "dahan",
      };
      agent
        .post(HOST + `/api/announcement`)
        .auth(`${token}`, { type: "bearer" })
        .send(data)
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          console.log(res.body);
          expect(res.body.resCode).toBe("announcementCreated");
          done();
        });
    });
  });
  
  describe("GET announcement API ", () => {
    test("test if we can get the announcement history, should return one record", (done) => {
      const data = {
        content: "create announcement",
        username: "dahan",
      };
      agent
        .get(HOST + `/api/announcement`)
        .auth(`${token}`, { type: "bearer" })
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("announcementQueried");
          done();
        });
    });
  });
  
  

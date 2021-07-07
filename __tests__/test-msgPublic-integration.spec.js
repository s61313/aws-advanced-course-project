let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  await app.db.getConnection().awaitQuery("TRUNCATE msg");
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

/**Start of testing for search status/private chat/public chat api */
describe("POST public message API ", () => {
  test(`test if the public mesaage can be created`, (done) => {
    const data = {
      content: "create a public chat message",
      username: "dahan",
      status: "ok",
      sOnline: "true",
    };
    agent
      .post(HOST + `/api/messages/public`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("msgCreated");
        done();
      });
  });
});

describe("GET public message API ", () => {
  test("test if we can get the public chat history, should return one record", (done) => {
    //create the status history
    agent
      .get(HOST + `/api/messages/public`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("publicMsgQueried");
        done();
      });
  });
});

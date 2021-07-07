let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  await app.db.getConnection().awaitQuery("TRUNCATE privatemsg");
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
describe("POST private message API ", () => {
  test(`test if the private mesaage can be created`, (done) => {
    const data = {
      content: "hello test create private message",
      sendingUsername: "dahan",
      senderStatus: "ok",
      receivingUsername: "sherry",
      receiverStatus: "ok",
    };
    agent
      .post(HOST + `/api/messages/private`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("privateMsgCreated");
        done();
      });
  });
});

 test("get chat history in private chat by sender and receiver, should return one record", (done) => {
   const sendingUsername = "dahan";
   const receivingUsername = "sherry";
   //create the status history
   agent
     .get(
       HOST + `/api/messages/private/${sendingUsername}/${receivingUsername}`
     )
     .auth(`${token}`, { type: "bearer" })
     .end(function (err, res) {
       expect(err).toBe(null);
       expect(res.statusCode).toBe(200);
       expect(res.body.resCode).toBe("PrivateMsgsFound");
       done();
     });
 });

describe("GET private message API ", () => {
  test("get unread messages in private chat by username, hould return one record", (done) => {
    const username = "sherry";
    //create the status history
    agent
      .get(HOST + `/api/users/${username}/private`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("foundSenders");
        done();
      });
  });
});


describe("UPDATE a private message API ", () => {
  test(`test if the private mesaage can be marked as unread`, (done) => {
      const sendingUsername = "dahan";
      const receivingUsername = "sherry";
      const data = {isRead: "read"};
    agent
      .put(
        HOST + `/api/messages/private/${sendingUsername}/${receivingUsername}`
      )
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("updateUnreadToRead");
        done();
      });
  });
});

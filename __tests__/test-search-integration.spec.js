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
  await app.db.getConnection().awaitQuery("TRUNCATE msg");
  await app.db.getConnection().awaitQuery("TRUNCATE status");
  await app.db.getConnection().awaitQuery('INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES ("Hello", "dahan", "sherry", "unread")');
  await app.db.getConnection().awaitQuery('INSERT INTO msg (content, sendername, senderstatus ) VALUES ("Hello", "dahan", "OK")');
  await app.db.getConnection().awaitQuery('INSERT INTO status (username, status) VALUES ("dahan", "OK")');

  await app.db
    .getConnection()
    .awaitQuery(
      "INSERT INTO user (username, password, isonline, status) VALUES ('test1', '1234', '1', '1')"
    );
  

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
describe("Search private chat api ", () => {
  test(`get user status history in private chat, should return one record for user`, (done) => {
    var username = "dahan";
    agent
      .get(HOST + `/api/status/${username}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('userStatusSearchOk');
        done();
      });
  });

  test("get chat history in private chat by sender and receiver and keywords hello, should return one record", (done) => {
    const sendingUsername = "dahan";
    const receivingUsername = "sherry";
    const keywords = "hello";
    //create the status history
    agent
      .get(
        HOST + `/api/messages/private/${sendingUsername}/${receivingUsername}`
      )
      .auth(`${token}`, { type: "bearer" })
      .query({ keywords: keywords })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('PrivateMsgsFound');
        done();
      });
  });

  test("get chat history in public chat by keywords hello, should return one record", (done) => {
    const keywords = "hello";
    //create the status history
    agent
      .get(HOST + `/api/messages/public`)
      .query({ keywords: keywords })
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('publicMsgQueried');
        done();
      });
  });
});

describe("Search user list api ", () => {
  test("get user status search in ESN directory by keywords 1 (OK), should return one record", (done) => {
    const status = "1";
    //create the status history
    agent
      .get(HOST + `/api/users`)
      .query({ status: status })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('usersstatusQueried');
        done();
      });
  });

  test("get user name search in ESN directory by keywords test1, should return one record", (done) => {
    const username = "test1";
    //create the status history
    agent
      .get(HOST + `/api/users`)
      .query({ username: username })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('userQueried');
        done();
      });
  });
});

describe("Search announcement api ", () => {
  test("get user announcement search in announcement by keywords hi, should return one record", (done) => {
    const keywords = "hi";
    //create the status history
    agent
      .get(HOST + `/api/announcement`)
      .auth(`${token}`, { type: "bearer" })
      .query({ keywords: keywords })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('announcementQueried');
        done();
      });
  });
});

describe("Search announcement api negative case (illegal)", () => {
  test("get user announcement search in announcement by keywords his, should result in an illegal query warning", (done) => {
    const keywords = "his";
    //create the status history
    agent
      .get(HOST + `/api/announcement`)
      .auth(`${token}`, { type: "bearer" })
      .query({ keywords: keywords })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.body.resCode).toBe('StopWordsOnly');
        done();
      });
  });
});

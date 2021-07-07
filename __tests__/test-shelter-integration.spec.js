let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  await app.db.getConnection().awaitQuery("TRUNCATE shelterentries");
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

/*brief tests*/
describe('Shelter Router get-compatible tests ', () => {
    test('get Shelter compatible', (done) => {
      agent.get(HOST + `/api/shelters/search`)
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          done();
        });
      });
  });

  describe('Shelter Router get-own tests ', () => {
    test('get Shelter own', (done) => {
      agent.get(HOST + `/api/shelters`)
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          done();
        });
      });
  });

describe('Shelter Router post tests ', () => {
    test('post Shelter', (done) => {
      agent.post(HOST + `/api/shelters`)
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          done();
        });
      });
  });

  describe('Shelter Router delete tests ', () => {
    test('delete Shelter', (done) => {
      agent.delete(HOST + `/api/shelters`)
        .send()
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          done();
        });
      });
  });

/*more detailed api tests*/
describe("POST shelter API ", () => {
  test(`test if a shelter can be created`, (done) => {
    const data = { 
        providername: "dahan", 
        address: "123 example", 
        residenceType: "House", 
        occupancy: 2, 
        petFriendly: 1, 
        disFriendly: 1
     };
    agent
      .post(HOST + `/api/shelters`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("createShelterSuccess");
        expect(res.body.data.insertId).toBe(4);
        done();
      });
  });
});

describe("GET compatible shelters API ", () => {
 test("get compatible shelter by party size, pet, and disability accomodations, should return one record", (done) => {
    const data = { 
        partySize: 2, 
        petAccom: 1, 
        disAccom: 1
     };
   //create the status history
   agent
     .get(
       HOST + `/api/shelters/search`
     )
     .auth(`${token}`, { type: "bearer" })
     .send(data)
     .end(function (err, res) {
       expect(err).toBe(null);
       expect(res.statusCode).toBe(200);
       expect(res.body.resCode).toBe("sheltersFound");
       done();
     });
 });
});

describe("GET own shelter API ", () => {
  test("get own shelter by username, should return one record", (done) => {
    const data = {providername: "dahan"};
    //create the status history
    agent
      .get(
          HOST + `/api/shelters`
      )
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("shelterFound");
        done();
      });
  });
});


describe("DELETE own shelter API", () => {
  test(`test if own (matchin username) shelter can be deleted`, (done) => {
    const data = {providername: "dahan"};
    //create the status history
    agent
      .delete(
          HOST + `/api/shelters`
      )
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("shelterDeleted");
        expect(res.body.data.affectedRows).toBe(1);
        done();
      });
  });
});

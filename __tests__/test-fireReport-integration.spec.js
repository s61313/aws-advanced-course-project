const { compareSync } = require("bcryptjs");
let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  await app.db.getConnection().awaitQuery("TRUNCATE firereport");
  const res = await agent
    .post(HOST + "/api/users")
    .send({ username: "testUser001", password: "1234" });
  token = res.body.data.token;
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"dahan\", \"UCSD\", \"pending\", \"unchecked\", \"unchecked\")");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"dahan\", \"UCLA\", \"approved\", \"unchecked\", \"checked\")");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"dahan\", \"UCSB\", \"denied\", \"unchecked\", \"unchecked\")");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"sherry\", \"UCD\", \"denied\", \"unchecked\", \"unchecked\")");
});

afterAll(async () => {
  //pass a callback to tell jest it is async
  if (app.server.listening) {
    await app.db.endConnection();
    await app.server.close();
  }
});

/**Start of testing for search status/private chat/public chat api */
describe("POST fire reports API ", () => {
  test(`test if a new fire report can be created, by providing reporterUsername and fireReportLation, should create on record`, (done) => {
    const data = {
        reporterUsername: "dahan",
        fireReportLocation: "La Jolla"
    };
    agent
      .post(HOST + `/api/fireReports`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("fireReportCreated");
        done();
      });
  });
  test(`test if a new fire report can be created, by providing reporterUsername and missing fireReportLation, should fail to create`, (done) => {
    const data = {
      reporterUsername: "dahan",
    };
    agent
      .post(HOST + `/api/fireReports`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("missingFireReportInformation");
        expect(res.body.isError).toBe("true");
        done();
      });
  });
});

describe("GET fire reports API ", () => {
  test(`test retrieve fire reports without query parameters, should return 5 records`, (done) => {
    agent
      .get(HOST + `/api/fireReports`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("fireReportsQueried");
        expect(res.body.data.length).toBe(5);
        done();
      });
  });

   test(`test retrieve fire reports with query parameter fireReportStatus approved, should return one record`, (done) => {
     agent
       .get(HOST + `/api/fireReports?fireReportStatus=approved`)
       .auth(`${token}`, { type: "bearer" })
       .end(function (err, res) {
         expect(err).toBe(null);
         expect(res.statusCode).toBe(200);
         expect(res.body.resCode).toBe("fireReportsQueried");
         expect(res.body.data.length).toBe(1);
         done();
       });
   });
});

describe("GET a fire report by fire report Id API ", () => {
  test(`test retrieve a fire report with fireReportId 4, should return one record made by dahan`, (done) => {
    agent
      .get(HOST + `/api/fireReports/4`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("fireReportQueried");
        expect(res.body.data[0].reporterUsername).toBe("dahan");
        done();
      });
  });
});

describe("PUT/UPDATE fire report by fire report Id and parameters API ", () => {
  test(`test update fire report with fireReportId 4, set the fireReportStatus to denied, should affect one record`, (done) => {
    agent
      .put(HOST + `/api/fireReports/4?fireReportStatus=denied`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("fireReportUpdated");
        expect(res.body.data.changedRows).toBe(1);
        done();
      });
  });

    test(`test update fire report with fireReportId 4, set the fireReportStatus to approved, should affect one record`, (done) => {
      agent
        .put(HOST + `/api/fireReports/4?fireReportStatus=approved`)
        .auth(`${token}`, { type: "bearer" })
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("fireReportUpdated");
          expect(res.body.data.changedRows).toBe(1);
          done();
        });
    });

    test(`test update fire report with fireReportId 4, set the citizenCheck to unchecked, shoudl affect one record`, (done) => {
        agent
          .put(HOST + `/api/fireReports/4?adminCheck=checked`)
          .auth(`${token}`, { type: "bearer" })
          .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            expect(res.body.resCode).toBe("fireReportUpdated");
            expect(res.body.data.changedRows).toBe(1);
            done();
          });
    });
});

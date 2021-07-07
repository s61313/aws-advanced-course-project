const FireReportModel = require("../models/fireReportModel.js");
var app = require("../main.js");
jest.setTimeout(30000);

beforeAll(async () => {
  await app.server.listen(8080);
  await app.db.getConnection().awaitQuery("TRUNCATE firereport");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"dahan\", \"UCSD\", \"pending\", \"unchecked\", \"unchecked\")");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"dahan\", \"UCLA\", \"approved\", \"unchecked\", \"checked\")");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"dahan\", \"UCSB\", \"denied\", \"unchecked\", \"unchecked\")");
  await app.db.getConnection().awaitQuery("INSERT INTO firereport (reporterUsername, fireReportLocation, fireReportStatus, adminCheck, citizenCheck ) VALUES (\"sherry\", \"UCD\", \"denied\", \"unchecked\", \"unchecked\")");
});

afterAll(async () => {
  await app.db.getConnection().awaitQuery("TRUNCATE firereport");
  if (app.server.listening) {
    await app.db.endConnection();
    await app.server.close();
  }
});

describe("test fire report constructor", () => {
  test("test fire report constructor", async () => {
    const fireReport = new FireReportModel("dahan", "La Jolla", "pending","unchecked", "unchecked");
    expect(fireReport.reporterUsername).toBe("dahan");
    expect(fireReport.fireReportLocation).toBe("La Jolla");
    expect(fireReport.fireReportStatus).toBe("pending");
    expect(fireReport.adminCheck).toBe("unchecked");
    expect(fireReport.citizenCheck).toBe("unchecked");
  });
});
describe("test create function for fire report", () => {
  test("create a new fire report, one record will be inserted into db", async () => {
    const reporterUsername = "dahan";
    const fireReportLocation = "La Jolla";

    return await FireReportModel.create(
      reporterUsername,
      fireReportLocation,
    ).then((dbResp) => {
      expect(dbResp.affectedRows).toBe(1);
    });
  });
});

describe("test getFireReports function", () => {
  test("get all the fire reports, should return five records", async () => {
    return await FireReportModel.getFireReports(undefined, undefined).then(
      (dbResp) => {
        expect(dbResp.length).toBe(5);
        expect(dbResp[0].reporterUsername).toBe("dahan");});
  });

  test("get fire reports by the reporterUsername dahan, should return four records by dahan", async () => {
    return await FireReportModel.getFireReports(undefined, "dahan").then(
      (dbResp) => {
        expect(dbResp.length).toBe(4);
        expect(dbResp[0].reporterUsername).toBe("dahan");
      }
    );
  });

  test("get fire reports by the fireReportStatus approved, should return one record of dahan", async () => {
    return await FireReportModel.getFireReports("approved", undefined).then(
      (dbResp) => {
        expect(dbResp.length).toBe(1);
        expect(dbResp[0].reporterUsername).toBe("dahan");
      }
    );
  });

    test("get fire reports by fireReportUsername dahan and fireReportStatus pending, should two records", async () => {
      return await FireReportModel.getFireReports("pending", "dahan").then(
        (dbResp) => {
          expect(dbResp.length).toBe(2);
          expect(dbResp[0].reporterUsername).toBe("dahan");
        }
      );
    });
});

describe("test getFireReportById function", () => {
  test("get fire report by reportId 4, should return a record of dahan, fire location is UCSD", async () => {

    return await FireReportModel.getFireReportById(
      4
    ).then((dbResp) => {
      expect(dbResp[0].reporterUsername).toBe("dahan");
      expect(dbResp[0].fireReportLocation).toBe("UCSD");
    });
  });
});

describe("test getReporterUsernameByFireReportId function", () => {
  test("get fire report by reportId 4, should return a reporterUsername of dahan", async () => {
    return await FireReportModel.getReporterUsernameByFireReportId(4).then(
      (dbResp) => {
        expect(dbResp[0].reporterUsername).toBe("dahan");
      }
    );
  });
});

describe("test getFireReportLocationByFireReportId function", () => {
  test("get fire report by reportId 4, should return a fireReportLocation of UCSD", async () => {
    return await FireReportModel.getFireReportLocationByFireReportId(4).then(
      (dbResp) => {
        console.log(dbResp);
        expect(dbResp.fireReportLocation).toBe("UCSD");
      }
    );
  });
});

describe("test updateFireReportFireStatusById function", () => {
  test("update fire report by reportId 4, set the fireReportStatus to denied,", async () => {
    return await FireReportModel.updateFireReportFireStatusById(4, "denied", undefined, undefined).then(
      (dbResp) => {
        expect(dbResp.changedRows).toBe(1);
      });
  });

  test("update fire report by reportId 4, set the citizenCheck to checked,", async () => {
    return await FireReportModel.updateFireReportFireStatusById(4, undefined, undefined, "checked").then(
      (dbResp) => {
        expect(dbResp.changedRows).toBe(1);
      });
  });

    test("update fire report by reportId 4, set the adminCheck to checked,", async () => {
    return await FireReportModel.updateFireReportFireStatusById(4, undefined, "checked", undefined).then(
      (dbResp) => {
        expect(dbResp.changedRows).toBe(1);
      });
  });
});

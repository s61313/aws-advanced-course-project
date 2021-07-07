let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

const username = "ted003";
var activityId;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  await app.db.getConnection().awaitQuery("TRUNCATE activity");
  await app.db.getConnection().awaitQuery("TRUNCATE activityuser");
  
  const res = await agent
    .post(HOST + "/api/users")
    .send({"username": "apiuser001", "password": "1234"});
  token = res.body.data.token; 
});

afterAll(async() => {
 
  await app.db.getConnection().awaitQuery("TRUNCATE activity");
  await app.db.getConnection().awaitQuery("TRUNCATE activityuser");
 
  if (app.server.listening) {
      await app.db.endConnection();
      await app.server.close();
    }
});

describe('Activity tests ', () => {
    test('Hold Activity', (done) => {
      const data = {
        organizer: username,
        activityName: "clean forest",
        activityTime: "03/19/2021 10:12:56",
        activityAddr:"Mountain View",
        numOfPeopleNeeded: 3,
        numOfHour: 5
       };
      agent
        .post(HOST + `/api/activity`)
        .auth(`${token}`, { type: "bearer" })
        .send(data)
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("activityCreated");
          expect(res.body.data[0].organizer).toBe(username);
          activityId = res.body.data[0].activityid;
          done();
        });
    });

});



describe('Activity tests 2', () => {
  test('Retrieve Created Activity By Username', (done) => {
    agent
      .get(HOST + `/api/activity?username=${username}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("FindActivityICreated");
        expect(res.body.data[0].organizer).toBe(username);
        done();
      });
  });  
})

describe('Activity tests 3', () => {
  test('Retrieve Created Activity By ActivityId', (done) => {
      
    agent
      .get(HOST + `/api/activity/${activityId}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("FindActivityById");
        expect(res.body.data[0].activityid).toBe(activityId);
        done();
      });
  });


})

describe('Activity tests 7', () => {
  test('Join Created Activity By Activity ID', (done) => {

    const usernameToJoin = "dahan";
    
    agent
      .post(HOST + `/api/activity/join/${activityId}?username=${usernameToJoin}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("activityJoined"); // no data returned 
        done();
      });
  });  
})

describe('Activity tests 4', () => {

  beforeAll((done) => {
    const data = {
      organizer: "username2",
      activityName: "clean forest 2",
      activityTime: "03/19/2021 10:12:56",
      activityAddr:"Mountain View",
      numOfPeopleNeeded: 3,
      numOfHour: 5
     };
    agent
      .post(HOST + `/api/activity`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("activityCreated");
        expect(res.body.data[0].organizer).toBe("username2");
        done();
      });    
  });  
  
  test('Retrieve All Joinable Activity', (done) => {

    const usernameToJoin = "dahan";
    
    agent
      .get(HOST + `/api/activity/waiting?usernameToJoin=${usernameToJoin}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("FindActivityToJoin");
        expect(res.body.data[0].activityStatus).toBe("WAITING");
        done();
      });
  });
})

describe('Activity tests 7', () => {
  test('Retrieve All Joined Activity By Username', (done) => {

    const usernameToJoin = "dahan";
    
    agent
      .get(HOST + `/api/activity/joined?username=${usernameToJoin}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("activityJoinedFound"); // no data returned 
        expect(res.body.data[0].username).toBe(usernameToJoin);
        done();
      });
  });  
})

describe('Activity tests 8', () => {
  test('UnJoin Created Activity By Activity ID', (done) => {

    const usernameToUnJoin = "dahan";
    
    agent
      .post(HOST + `/api/activity/unjoin/${activityId}?username=${usernameToUnJoin}`)
      .auth(`${token}`, { type: "bearer" })
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("activityUnjoined"); // no data returned 
        done();
      });
  });   
})

describe('Activity tests 5', () => {
  test('Update Created Activity Status By Activity ID', (done) => {

    const data = {
      status: "READY"
    };
    
    agent
      .put(HOST + `/api/activity/${activityId}`)
      .auth(`${token}`, { type: "bearer" })
      .send(data)
      .end(function (err, res) {
        expect(err).toBe(null);
        expect(res.statusCode).toBe(200);
        expect(res.body.resCode).toBe("activityUpdated");
        expect(res.body.data[0].activityStatus).toBe("READY");
        done();
      });
  }); 
})
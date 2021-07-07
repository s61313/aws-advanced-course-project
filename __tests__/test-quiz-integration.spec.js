let agent = require("superagent");
var app = require("../main.js");

jest.setTimeout(20000);

let PORT = 8080;
let HOST = "http://localhost:" + PORT;

var token;

beforeAll(async () => {
  await app.server.listen(PORT);
  await app.db.getConnection().awaitQuery("TRUNCATE user");
  await app.db.getConnection().awaitQuery("TRUNCATE quiz");
  await app.db.getConnection().awaitQuery("TRUNCATE quizrecord");
  await app.db.getConnection().awaitQuery(`INSERT INTO quiz (quiz, question1, q1option1, q1option2, answer1, question2, q2option1, q2option2, answer2, creator) 
                                          VALUES ('Wildfire Prevention', 'What happens during pre-ignition process in wildfires?', 'Gases cool and produce fuel', 'Gases heat and produce fuel', '1', 'Which is not required for a fire to burn?', 'Carbon dioxide', 'Oxygen', '1', 'Ted')`);
  await app.db.getConnection().awaitQuery(`INSERT INTO quizrecord (username, quiziddone) VALUES ('dahan', '4')`);
  const res = await agent
    .post(HOST + "/api/users")
    .send({ username: "dahan", password: "1234" });
  token = res.body.data.token;
  await app.db.getConnection().awaitQuery("UPDATE user SET score = 20 WHERE username='dahan'");
});

afterAll(async () => {
  //pass a callback to tell jest it is async
  if (app.server.listening) {
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    await app.db.getConnection().awaitQuery("TRUNCATE quiz");
    await app.db.getConnection().awaitQuery("TRUNCATE quizrecord");
    await app.db.endConnection();
    await app.server.close();
  }
});

describe("GET quiz socre by user name API ", () => {
    test("test if we can get user score", (done) => {
      agent
        .get(HOST + `/api/quiz?username=dahan`)
        .auth(`${token}`, { type: "bearer" })
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("getScoreByName");
          expect(res.body.data).toBe(20);
          done();
        });
    });

    test("test if we can get user score fail", (done) => {
      agent
        .get(HOST + `/api/quiz`)
        .auth(`${token}`, { type: "bearer" })
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("ErrorgetScoreByName");
          done();
        });
    });


  });

  describe("POST update user new score API ", () => {
    test("test if we can update user score", (done) => {
      
        const sendData = {
            username: 'dahan',
            score: 20, // only get the all answer right to get a whole socre. Otherwise, get 0.
            idquiz: 4
        };

        agent
            .post(HOST + `/api/quiz`)
            .auth(`${token}`, { type: "bearer" })
            .send(sendData)
            .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            expect(res.body.resCode).toBe("updateUserScore");
            expect(res.body.data).toBe(40);
            done();
            });
    });
  });

  describe("POST create new quiz API ", () => {
    test("test if we can create a new quiz", (done) => {
      
        const quiz_creation_info = {quiz: 'intergration test123', 
            question1: '1',
            q1option1: '1-1',
            q1option2: '1-2',
            answer1: '1',
            question2: '2',
            q2option1: '2-1', 
            q2option2: '2-2',
            answer2: '2',
            creator: 'dahan'
        };

        agent
            .post(HOST + `/api/quiz/creation`)
            .auth(`${token}`, { type: "bearer" })
            .send(quiz_creation_info)
            .end(function (err, res) {
            expect(err).toBe(null);
            expect(res.statusCode).toBe(200);
            expect(res.body.resCode).toBe("createNewQuiz");
            expect(res.body.data.affectedRows).toBe(1);
            done();
            });
    });
  });

  describe("GET quiz list API ", () => {
    test("test if we can get quiz list", (done) => {
      agent
        .get(HOST + `/api/quiz/list`)
        .auth(`${token}`, { type: "bearer" })
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("getQuizList");
          expect(res.body.data[0].creator).toBe("Ted");
          done();
        });
    });
  });

  describe("GET quiz record API ", () => {
    test("test if we can get quiz record", (done) => {
      agent
        .get(HOST + `/api/quiz/record?username=dahan`)
        .auth(`${token}`, { type: "bearer" })
        .end(function (err, res) {
          expect(err).toBe(null);
          expect(res.statusCode).toBe(200);
          expect(res.body.resCode).toBe("getQuizRecord");
          expect(res.body.data[0].quiziddone).toBe(4);
          done();
        });
    });
  });

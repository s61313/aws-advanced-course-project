const Quiz = require("../models/quizModel");

var app = require('../main.js');
jest.setTimeout(30000);

beforeAll(async()=>{
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    await app.db.getConnection().awaitQuery("TRUNCATE quiz");
    await app.db.getConnection().awaitQuery("TRUNCATE quizrecord");
    await app.db.getConnection().awaitQuery("INSERT INTO user (username, password, isonline, score) VALUES (\"dahan\", \"1234\", \"1\", \"20\")");
    await app.db.getConnection().awaitQuery(`INSERT INTO quiz (quiz, question1, q1option1, q1option2, answer1, question2, q2option1, q2option2, answer2, creator) 
                                            VALUES ('Wildfire Prevention', 'What happens during pre-ignition process in wildfires?', 'Gases cool and produce fuel', 'Gases heat and produce fuel', '1', 'Which is not required for a fire to burn?', 'Carbon dioxide', 'Oxygen', '1', 'Ted')`);
    await app.db.getConnection().awaitQuery(`INSERT INTO quizrecord (username, quiziddone) VALUES ('dahan', '4')`);

});

afterAll(async()=>{
    // await app.db.getConnection().awaitQuery("TRUNCATE user");
    if (app.server.listening) {
        await app.db.getConnection().awaitQuery("TRUNCATE user");
        await app.db.getConnection().awaitQuery("TRUNCATE quiz");
        await app.db.getConnection().awaitQuery("TRUNCATE quizrecord");
        await app.db.endConnection();
        await app.server.close();
    }    
});

// describe('unit test: get score by name from user table', () => {

//     test('successful case: getScoreByName', async () => {
//         const username = 'dahan';
//         return await Quiz.getScoreByName(username).then((dbResp) => {
//             console.log("dbResp : " + dbResp[0]);
//             expect(dbResp[0].score).toBe(20);
//         });
//     });
// });

// describe('unit test: get all quiz list from quiz table', () => {

//     test('successful case: findAllQuiz', async () => {
//         return await Quiz.findAllQuiz().then((dbResp) => {
//             expect(dbResp[0].creator).toBe('Ted');
//         });
//     });
// });

// describe('unit test: get quiz records of the user from quizrecord table', () => {

//     test('successful case: getQuizRecordbyUser', async () => {
//         const username = 'dahan';
//         return await Quiz.getQuizRecordbyUser(username).then((dbResp) => {
//             expect(dbResp[0].quiziddone).toBe(4);
//         });
//     });

// });

describe('unit test: update user\'s new score to user table', () => {

    test('successful case: updateScore', async () => {
        const username = 'dahan';
        const score = 300;
        return await Quiz.updateScore(username, score).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});

describe('unit test: insert new quiz to quiz table', () => {

    test('successful case: insertQuiz', async () => {
        const quiz_creation_info = {quiz: 'unit_test123', 
                                    question1: '1',
                                    q1option1: '1-1',
                                    q1option2: '1-2',
                                    answer1: '1',
                                    question2: '2',
                                    q2option1: '2-1', 
                                    q2option2: '2-2',
                                    answer2: '2',
                                    creator: 'dahan'};

        return await Quiz.insertQuiz(quiz_creation_info).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });

    test('failure case: insertQuiz', async () => {
        const quiz_creation_info = {quiz: null, 
                                    question1: '1',
                                    q1option1: '1-1',
                                    q1option2: '1-2',
                                    answer1: '1',
                                    question2: '2',
                                    q2option1: '2-1', 
                                    q2option2: '2-2',
                                    answer2: '2',
                                    creator: 'dahan'};
                                    
        return await Quiz.insertQuiz(quiz_creation_info).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(0);
        }).catch((e) => {
            expect(e.errno).toBe(1048);
        });
    });
});

describe('unit test: insert new quiz record to quizrecord table', () => {

    test('successful case: insertRecord', async () => {

        const username = 'dahan';
        const idquiz = '4';
        return await Quiz.insertRecord(username, idquiz).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });

    test('failure case: insertRecord', async () => {
       
        const username = 'dahan';
        const idquiz = null;
        return await Quiz.insertRecord(username, idquiz).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(0);
        }).catch((e) => {
            expect(e.errno).toBe(1048);
        });
    });
});
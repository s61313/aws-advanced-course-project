const msgModel = require("../models/msgModel");

var app = require('../main.js');
jest.setTimeout(30000);

beforeAll(async()=>{
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("TRUNCATE msg");
    await app.db.getConnection().awaitQuery("INSERT INTO msg (content, senderName) VALUES (\"Hi1\", \"dahan\")");
    await app.db.getConnection().awaitQuery("INSERT INTO msg (content, senderName) VALUES (\"Hi2\", \"dahan\")");
    await app.db.getConnection().awaitQuery("INSERT INTO msg (content, senderName) VALUES (\"Hi3\", \"apple\")");
    await app.db.getConnection().awaitQuery("INSERT INTO msg (content, senderName) VALUES (\"Hi4\", \"peach\")");
});

afterAll(async()=>{
    await app.db.getConnection().awaitQuery("TRUNCATE msg");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }    
});

describe('Find message by id ', () => {
    test('find message', async () => {
        const id = '4';
        return await msgModel.findMsg(id).then((dbResp) => {
            expect(dbResp[0].content).toBe("Hi1");
        });
    });
});

describe('Find all publics messages', () => {
    test('find all messages', async () => {
        
        return await msgModel.findPublicMsgs().then((dbResp) => {
            expect(dbResp.length).toBe(4);
        });
    });
});

describe('Find all messages containing keyword', () => {
    test('Find all messages containing keyword', async () => {
        const keywords = "2";
        return await msgModel.findPublicMsgsByKeywords(keywords).then((dbResp) => {
            expect(dbResp.data[0].content).toBe("Hi2");
        });
    });
});

describe('create public message', () => {
    test('create public message', async () => {
        const content = 'new message';
        const senderName = 'ted';
        const senderStatus = 1;
        const senderisonline = 1;
        const receiverName = null;
        return await msgModel.create(content,senderName,senderStatus,senderisonline,receiverName).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});



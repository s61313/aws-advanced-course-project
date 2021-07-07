const msgPrivateModel = require("../models/msgPrivateModel");

var app = require('../main.js');
jest.setTimeout(30000);

beforeAll(async () => {
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi1\", \"dahan\", \"nahad\", \"unread\")");
    await app.db.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi2\", \"dahan\", \"nahad\", \"unread\")");
    await app.db.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi3\", \"apple\", \"oreo\", \"unread\")");
    await app.db.getConnection().awaitQuery("INSERT INTO privatemsg (content, senderName, receiverName, isRead ) VALUES (\"Hi4\", \"peach\", \"oreo\", \"unread\")");
});

afterAll(async () => {
    await app.db.getConnection().awaitQuery("TRUNCATE privatemsg");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }
});



describe('Find all messages sent from sender username to receiver username ', () => {
    test('find all messages between two users', async () => {
        const senderName = 'dahan';
        const receiverName = 'nahad';
        return await msgPrivateModel.findMsgsBetween(senderName, receiverName).then((dbResp) => {
            expect(dbResp[0].content).toBe("Hi1") && expect(dbResp[1].content).toBe("Hi2");
        });
    });
});

describe('Find all senders with unread message count to a receiver ', () => {
    test('find who send unread messages to user', async () => {
        const receiverName = 'oreo';
        return await msgPrivateModel.findSendersWithUnreadMsgsByReceiver(receiverName).then((dbResp) => {
            expect(dbResp[0].username).toBe("apple") && expect(dbResp[1].username).toBe("peach");
        });
    });
});


describe('Changes all unread messages between sender and receiver to read ', () => {
    test('update messages to read', async () => {
        const senderName = 'dahan';
        const receiverName = 'nahad';
        return await msgPrivateModel.updateToReadBetween(senderName, receiverName).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(2) && expect(dbResp.changedRows).toBe(2);
        });
    });
});


describe('Find all messages sent from sender username to receiver username having keyword', () => {
    test('update messages to read', async () => {
        const keywords = "2";
        const senderName = 'dahan';
        const receiverName = 'nahad';
        return await msgPrivateModel.findMsgsBetweenByKeywords(keywords, senderName, receiverName).then((dbResp) => {
            expect(dbResp.data[0].content).toBe("Hi2");
        });
    });
});

describe('Find message by receiver name ', () => {
    test('find message by receiver name', async () => {
        const receiverName = 'nahad';
        return await msgPrivateModel.findMsgsByReceiverUsername(receiverName).then((dbResp) => {
            expect(dbResp.length).toBe(2);
        });
    });
});

describe('create msg, database should be updated by 1 row ', () => {
    test('create msg', async () => {
        const receiverName = 'det';
        const content = 'new message';
        const senderName = 'ted';
        const senderStatus = 1;
        const receiverStatus = 3;
        return await msgPrivateModel.create(content, senderName, receiverName, senderStatus, receiverStatus).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});


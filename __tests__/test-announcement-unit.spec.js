const Announcement = require("../models/announcementModel");
// const app.db = require('../utils/database.js');
jest.setTimeout(20000);
var app = require('../main.js');

beforeAll(async()=>{
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("INSERT INTO announcement (content, senderName) VALUES ('announcement2','dahan2')");
});

afterAll(async()=>{
    await app.db.getConnection().awaitQuery("TRUNCATE announcement");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }    
});

describe('user can create announcement ', () => {
    test('create a announcement', async () => {
        const senderName = 'fake_username';
        return await Announcement.create('announcement',senderName).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});
describe('announcement can be searched by id', () => {
    test('Search announcement', async () => {
        return await Announcement.findAnnouncement(14).then((dbResp) => {
            expect(dbResp[0].announcementid).toBe(14);
        });
    });
});


describe('find all announcements', () => {
    test('search all announcements', async () => {
        return await Announcement.findAnnouncements().then((dbResp) => {
            expect(dbResp.length).toBe(2);
        });
    });
});
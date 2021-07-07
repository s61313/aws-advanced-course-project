const activityModel = require("../models/activityModel.js");

var app = require('../main.js');
jest.setTimeout(30000);

var activityId;
const username = 'unittestuser001';
const activityName = 'clean forest';
const activityTime = '03/19/2021 10:12:56';
const activityAddr = 'Mountain View';
const numOfPeopleNeeded = 3;
const numOfHour = 5;

const usernameToJoin = "dahan";

const status = "READY";

beforeAll(async () => {
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("TRUNCATE activity");
    await app.db.getConnection().awaitQuery("TRUNCATE activityuser");  
});

afterAll(async () => {
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }
});


describe('Activity Unit Test ', () => {
    test('create & find to Join', async () => {

        return await activityModel.create(username, activityName, activityTime, activityAddr, numOfPeopleNeeded, numOfHour).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
            activityId = dbResp.insertId;
        });

    });

    test('update', async () => {

        return await activityModel.update(activityId, status).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
        
    });    

    test('findActivityById', async () => {

        return await activityModel.findActivityById(activityId).then((dbResp) => {
            expect(dbResp[0].activityid).toBe(activityId);
            expect(dbResp[0].activityStatus).toBe(status);
            expect(dbResp[0].activityName).toBe(activityName);
        });
        
    });     

    test('findActivityByOrganizer', async () => {
        
        return await activityModel.findActivityByOrganizer(username).then((dbResp) => {
            expect(dbResp[0].activityid).toBe(activityId);
            expect(dbResp[0].activityStatus).toBe(status);
            expect(dbResp[0].activityName).toBe(activityName);
        });
        
    });  

    test('findActivityToJoin', async () => {

        await activityModel.create(username, activityName, activityTime, activityAddr, numOfPeopleNeeded, numOfHour).then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
        
        return await activityModel.findActivityToJoin(usernameToJoin).then((dbResp) => {
            expect(dbResp[0].activityStatus).toBe("WAITING");
        });
            
    });      

    test('join', async () => {
        
        return await activityModel.join(activityId, usernameToJoin).then((dbResp) => {
            expect(dbResp[0].affectedRows).toBe(1);
            expect(dbResp[1].affectedRows).toBe(1);
        });
        
    });      

    test('findActivityJoined', async () => {
        
        return await activityModel.findActivityJoined(usernameToJoin).then((dbResp) => {
            expect(parseInt(dbResp[0].activityid)).toBe(activityId);
        });
        
    });

    test('unjoin', async () => {
        
        return await activityModel.unjoin(activityId, usernameToJoin).then((dbResp) => {
            expect(dbResp[0].affectedRows).toBe(1);
            expect(dbResp[1].affectedRows).toBe(1);
        });
        
    });
    

    




});

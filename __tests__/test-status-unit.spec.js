const statusModel = require("../models/statusModel");
var app = require('../main.js');

beforeAll(async()=>{
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    await app.db.getConnection().awaitQuery("TRUNCATE status");    
    await app.db.getConnection().awaitQuery("INSERT INTO user (username) VALUES (\"dahan\")");
});

afterAll(async()=>{
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    await app.db.getConnection().awaitQuery("TRUNCATE status");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }    
});



describe('Setting status should insert new username, status entry into status table', () => {
  test('Setting status of user', async () => {
    const status = '1';
    const userName = "dahan";
        return await statusModel.setNewStatus(userName,status).then((dbResp) => {
            expect(dbResp[0].affectedRows).toBe(1) && expect(dbResp[1].changedRows).toBe(1);
        });
  });
  
})









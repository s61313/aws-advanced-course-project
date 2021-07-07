const User = require("../models/userModel");
var app = require('../main.js');

beforeAll(async()=>{
    await app.server.listen(8080);
    await app.db.getConnection().awaitQuery("TRUNCATE user");
});

afterAll(async()=>{
    await app.db.getConnection().awaitQuery("TRUNCATE user");
    if (app.server.listening) {
        await app.db.endConnection();
        await app.server.close();
    }    
});
  
describe('User registration ', () => {
    test('Registers a User', async () => {
        const userName = 'fake_username';
        return await User.create(userName,'password').then((dbResp) => {
            expect(dbResp.affectedRows).toBe(1);
        });
    });
});

describe('Search user by name ', () => {
    test('Seach by username', async () => {
        const userName = 'fake_username';
        return await User.findUserByName(userName).then((dbResp) => {
            expect(dbResp[0].username).toBe(userName);
        });
    });
});






var jwt = require('jsonwebtoken')
const secret_server = '12ejaisja0sijdq'; 

class JWTService {
    constructor() {
        this.tokenLoggedoutMap = new Map();
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new JWTService();
        }

        return this._instance;  
    }

    generate_token(result){
        var token = jwt.sign(result, secret_server, {
            expiresIn: 1200000
        });
        return token;      
    }

    is_token_valid(token) {
        if (this.tokenLoggedoutMap.has(token)) {
            return false;
        }

        try {
            jwt.verify(token, secret_server); // this is not a Promise object, so we cannot use .then .catch syntax 
            return true;
        }catch(err) {
            return false;
        }
    }

    add_loggedout_token(token) {
        this.tokenLoggedoutMap.set(token, "invalid");
    }

}

module.exports = JWTService;
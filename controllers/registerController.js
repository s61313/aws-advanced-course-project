const mydb = require("../utils/database.js");
const blacklistModel = require("../utils/blacklist.js");
const blacklist = blacklistModel.getBlacklist();
const bcrypt = require("bcryptjs");
const HttpResponse = require("./httpResponse.js");
const userModel = require("../models/userModel.js");
const authService = require("../utils/auth.js");
const SocketioService = require("../utils/socketio");


async function findUserByNameWithoutPwd(username) {
  var resMsg = checkUsernameFormat(username);
  if (resMsg !== "") {
    return new HttpResponse(resMsg, "invalidUsername", "true");
  }
  resMsg = await userModel
    .findUserByNameWithoutPwd(username)
    .then((dbResult) => {
    
      return new HttpResponse("User Search OK.", "userSearchOk", "false", dbResult);
    })
    .catch((err) => {
      return new HttpResponse("User Search Failed.", "userSearchFailed", "true", err);
    });
  return resMsg;
}

async function createUser(username, password) {
  var resMsg = "";
  if (resMsg !== "") {
    return new HttpResponse(resMsg, "invalidPassword", "true");
  }
  resMsg = await userModel
    .create(username, password)
    .then((dbResult) => {
      return userModel.setUserOnline(username);
    })
    .then( (result) => {
      const token = authService.getInstance().generate_token({"username":username});
      return new HttpResponse("User is created.", "userCreated", "false", {"token": token});
    })
    .then((result) => {
      // when a user login, broadcast updated userlist to all online users
      const result2 = SocketioService.getInstance().updateUserlist();
      return result;
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err);
    });
  return resMsg;
}

async function login(username, password) {
  
  var resMsg = "";
  if (resMsg !== "") {
    return new HttpResponse(resMsg, "invalidPassword", "true");
  }
  resMsg = await userModel
    .findUserByName(username)
    .then((userList) => {
      if (userList.length == 0) {
        throw new Error("user not found");
      }
      
      const isMatch = bcrypt.compareSync(password, userList[0].password)
      return {
        isMatch: isMatch,
        user: userList[0]
      }; // return a Promis; we'll wait for it to finish before continuing
    })
    .then((result) => {
      return setToken(result);
    })
    .then((result) => {
       // when a user login, broadcast updated userlist to all online users
       const result2 = SocketioService.getInstance().updateUserlist();
       return result;
    })
    .catch((err) => {
      return new HttpResponse("db error.", "dbError", "true", err.message);
    });
  return resMsg;
}

function setToken(result) {
    if (result.isMatch) {
      // successful login http response
      userModel.setUserOnline(result.user.username);
      
      // create JWT token logic here
      const token = authService.getInstance().generate_token(result);
      return new HttpResponse("User is logged in successfully.", "loginSuccessful", "false",
        {"token": token,"username": result.user.username,"userstatus": convertToStatusDescription(result.user.status)}
      );
    } else {
      return new HttpResponse("Username and/or password is incorrect. Please try again.", "passwordIncorrect","true"); // incorrect password http response
    }
}

function checkUsernameFormat(username) {
  var resMsg = "";
  var reg = /^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/;
  if (username.length < 3 || !reg.test(username)) {
    resMsg =
      "username should have at least 3 characters, can contain any letters from a to z and any numbers from 0 through 9, please try again";
  } else {
    if (blacklist.includes(username.toLowerCase())) {
      resMsg = "username is in blacklist. Please try again.";
    }
  }
  return resMsg;
}

function verifyJwtToken(req, res, next) {

  var token = req.headers['authorization'] || req.cookies.token;
  if (token) {
      token = token.replace("Bearer ", "") 
  }
  if (token) {
    const is_token_valid = authService.getInstance().is_token_valid(token);
    if (is_token_valid == false) {
      return res.status(403).redirect("/");       
      
    }else {
      console.log("token verified");
      next();
    }
  } else {
    return res.status(403).redirect("/");       

  }
}

async function logout(username, token) {

  await(userModel.setUserOffline(username));
  authService.getInstance().add_loggedout_token(token);
  console.log("remove socket of username: " + username)
  const result = await SocketioService.getInstance().removeSocket(username);

  // when a user login/ logout, broadcast updated userlist to all online users
  const result2 = await SocketioService.getInstance().updateUserlist();

  return new HttpResponse("Socket is removed.", "socketRemoved", "false");  
}




function convertToStatusDescription(statusCode){
  if (statusCode === "1") {
    return "OK";
  }else if (statusCode === "2") {
    return "HELP";
  }else if (statusCode === "3") {
    return "EMERGENCY";
  }
  return statusCode;
}


//start seach user by status/username ------------------------------

//search user by status
function getUsersbyStatus(status) {
  return userModel.findUserByStatus(status)
      .then((dbResult) => {
          if (dbResult.case === "legal") {
              return new HttpResponse("UserStatus is queried.", "usersstatusQueried", "false", dbResult.data);
          } 
      })
      .catch((err) => {
          return new HttpResponse("db error.", "dbError", "true", err);
      });
}




//search user by username
async function getUsers(keywords) {
  var resMsg;
  if (keywords) {
      resMsg = await findUserByNameKeywordsHelper(keywords);
      console.log(`searching by keyword ${keywords}`);
  } else {
      console.log('keyword is null');
      resMsg = await findUsersHelper();
  }
  return resMsg;
}


function findUserByNameKeywordsHelper(keywords) {
  return userModel.findUserByNameKeywords(keywords)
      .then((dbResult) => {
          if (dbResult.case === "legal") {
              return new HttpResponse("User is queried.", "userQueried", "false", dbResult.data);
          } else if (dbResult.case === "illegal") {
              return new HttpResponse("Only Stop Words.", "StopWordsOnly", "false", dbResult.data);
          }
      })
      .catch((err) => {
          return new HttpResponse("db error.", "dbError", "true", err);
      });
}

function findUsersHelper() {
  return userModel.getAllUsersWithoutPwd()
      .then((dbResult) => {
          return new HttpResponse(
              "User is queried.",
              "userQueried",
              "false",
              dbResult
          );
      })
      .catch((err) => {
          return new HttpResponse("db error.", "dbError", "true", err);
      });
}



module.exports = {
  createUser: createUser,
  findUserByNameWithoutPwd: findUserByNameWithoutPwd,
  //getAllUsersWithoutPwd: getAllUsersWithoutPwd,
  getUsers: getUsers,
  getUsersbyStatus: getUsersbyStatus,
  login: login,
  verifyJwtToken: verifyJwtToken,
  logout: logout
};

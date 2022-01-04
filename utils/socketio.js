const socketio = require("socket.io");
class MySocketIOService {
    constructor(server) {
        if (!MySocketIOService._instance) {
            MySocketIOService._instance = this;
        }
        
        if (process.env.mode === "local") {
            console.log("local mode, so no socket created");
        }else {
            this.io = socketio(server);
            this.usernameSocketMap = new Map();
            this.socketUsernameMap = new Map();
            this.setupSocketIOHelper();
        }

        return MySocketIOService._instance;
    }

    static getInstance() {
        return this._instance;  
    }

    setupSocketIOHelper() {
        this.io.on("connection", (socket) => {   
        console.log('A user connected');
            socket.on('bindUserNameWithSocket', (username) => {
                console.log('username binding with socket connection');
                if (this.usernameSocketMap.has(username)) {
                    this.usernameSocketMap.delete(username);
                    this.socketUsernameMap.delete(socket);
                }
                this.usernameSocketMap.set(username, socket);
                this.socketUsernameMap.set(socket, username);
            });    
        
            socket.on('disconnect', () => {
                console.log('user disconnected');
                if (this.socketUsernameMap.has(socket)) {
                    const username = this.socketUsernameMap.get(socket);
                    this.usernameSocketMap.delete(username);
                    this.socketUsernameMap.delete(socket);
                }
            });
        });
    }
    
    pushMsg(msg) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                this.usernameSocketMap.forEach((socket, username, map)=>{
                    socket.emit('public message', msg);
                })
            }
            resolve("msg pushed");
        })
    } 

    pushAnnouncement(msg,topic) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                this.usernameSocketMap.forEach((socket, username, map)=>{
                    socket.emit(topic, msg);
                })
            }
            resolve("announcement pushed");
        })
    } 

    //I4-andy***************************************************************
    pushShelter(topic) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                this.usernameSocketMap.forEach((socket, username, map)=>{
                    socket.emit(topic);
                })
            }
            resolve("shelter pushed");
        })
    }

    pushMsgToUser(msg, topic, username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                if (this.usernameSocketMap.has(username)) {
                    const sokcet = this.usernameSocketMap.get(username);
                    sokcet.emit(topic, msg);
                    resolve("msg pushed to " + username);
                }
                resolve("user is not online");
            }else{
                resolve("this is local mode, so no socket is created");
            }
        })

    } 

    updateStatus(status, name) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                this.usernameSocketMap.forEach((socket, username, map)=>{
                    socket.emit('update status', [status, name]);
                })
            }
            resolve("update status");
        })
    } 

    // (dynamic update) If user login or logout, broadcast the updated userlist to all online users
    updateUserlist() {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                this.usernameSocketMap.forEach((socket, username, map)=>{
                    socket.emit('update userlist');
                })
            }
            resolve("update userlist");
        })
    } 
    sendECrequest(username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                if (this.usernameSocketMap.has(username)) {
                    const sokcet = this.usernameSocketMap.get(username);
                    sokcet.emit('pendingrequest');
                    resolve("request pushed to " + username);
                }
                resolve("user is not online");
            }else{
                resolve("this is local mode, so no socket is created");
            }
        })

    } 

    acceptECrequest(username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                if (this.usernameSocketMap.has(username)) {
                    const sokcet = this.usernameSocketMap.get(username);
                    sokcet.emit('accept');
                    resolve("request pushed to " + username);
                }
                resolve("user is not online");
            }else{
                resolve("this is local mode, so no socket is created");
            }
        })

    } 

    declineECrequest(username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                if (this.usernameSocketMap.has(username)) {
                    const sokcet = this.usernameSocketMap.get(username);
                    sokcet.emit('decline');
                    resolve("request pushed to " + username);
                }
                resolve("user is not online");
            }else{
                resolve("this is local mode, so no socket is created");
            }
        })

    } 

    acknowledgeECrequest(username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                if (this.usernameSocketMap.has(username)) {
                    const sokcet = this.usernameSocketMap.get(username);
                    sokcet.emit('acknowledged');
                    resolve("request pushed to " + username);
                }
                resolve("user is not online");
            }else{
                resolve("this is local mode, so no socket is created");
            }
        })

    } 
    
    //when user send EC request, his/her em button should turn grey immediately
    pendingRequestUpdateEMcolor(username) {
        return new Promise((resolve, reject) => {
            if (this.usernameSocketMap) {
                if (this.usernameSocketMap.has(username)) {
                    const sokcet = this.usernameSocketMap.get(username);
                    sokcet.emit('updatecolor');
                    resolve("request pushed to " + username);
                }
                resolve("user is not online");
            }else{
                resolve("this is local mode, so no socket is created");
            }
        })

    } 


  sendFireReportToUser(topic, username) {
    return new Promise((resolve, reject) => {
      if (this.usernameSocketMap) {
        if (this.usernameSocketMap.has(username)) {
          const sokcet = this.usernameSocketMap.get(username);
          sokcet.emit(topic, username);
          resolve("fireReport pushed to " + username);
        }
        resolve("user is not online");
      } else {
        resolve("this is local mode, so no socket is created");
      }
    });
  }

  sendFireMarkerToMap(fireReportLocation) {
    return new Promise((resolve, reject) => {
      if (this.usernameSocketMap) {
        this.usernameSocketMap.forEach((socket) => {
          socket.emit("sendFireMarkerToMap", fireReportLocation);
        });
      }
      resolve("sendFireMarkerToMap");
    });
  }

  removeSocket(username) {
    return new Promise((resolve, reject) => {
      if (this.usernameSocketMap) {
        if (this.usernameSocketMap.has(username)) {
          this.usernameSocketMap.get(username).disconnect();
        }
      }
      resolve("socket removed");
    });
  }
}

module.exports = MySocketIOService;


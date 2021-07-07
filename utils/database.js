/** db - start **/
// var mysql = require('mysql')
// const mysql = require('mysql-await');
// var connection = mysql.createConnection({
//   host: 'us-cdbr-east-03.cleardb.com',
//   user: 'be16f423ed304c',
//   password: '39e3a742',
//   database: 'heroku_0cb61785f937545'
// })
// connection.connect()
// /** db - end **/

const mysql = require('mysql-await');
const dotenv = require('dotenv');

dotenv.config('./env');
var db_config = {
  host: process.env.MYSQL_FORMAL_HOST_URL,
  user: process.env.MYSQL_FORMAL_USER,
  password: process.env.MYSQL_FORMAL_PASSWORD,
  database: process.env.MYSQL_FORMAL_DATABASE
};

var localdb_config = {
  host: process.env.MYSQL_HOST_URL,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE
};

// IMPORTNAT: for CircleCI, we need to set environment variable there for db connection 

var connection;
// var isServerDown = false;

function getConnection() {
  return connection;
}

function endConnection() {
    return new Promise((resolve, reject) => {
      connection.end(function(err) {
        // The connection is terminated now
        // isServerDown = true;
        resolve();
      });
  })
}

function handleDisconnect() {
  console.log('db connection building');

  if (process.env.mode === "local") {
    console.log(`using local db`);
    console.log(localdb_config);
    connection = mysql.createConnection(localdb_config); // Recreate the connection, since
  }else {
    console.log(`using remote db`);
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.
  }

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                      // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      console.log('PROTOCOL_CONNECTION_LOST happened 456');
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
  console.log('db connection built');
}

handleDisconnect();
module.exports = {
  getConnection: getConnection,
  endConnection: endConnection
};
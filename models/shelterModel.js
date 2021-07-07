const mydb = require('../utils/database.js');

class Shelter {

  // constructor(content, providername,) {
  //   this.content = content;
  //   this.providername = providername;
  //   // this.senderisonline = senderisonline;
  //   // this.receivername = receivername;
  // }

  static create(providername, address, residenceType, occupancy, petFriendly, disFriendly) {//change parameters and sql columns
    return new Promise((resolve, reject) => {
      const sql_create_shelter = "INSERT INTO shelterentries (providername, address, residencetype, occupancy, petfriendly, disfriendly) VALUES ?";
      mydb.getConnection().awaitQuery(sql_create_shelter, [[[providername, address, residenceType, occupancy, petFriendly, disFriendly]]])
        .then((result) => {
          resolve(result);
        })
        // .catch((err) => {
        //   reject(err);
        // });
    });
  }

  //this one is mostly done
  // static findShelter(entryid) {//finds the most recently created one to push via socket
  //   return new Promise((resolve, reject) => {
  //     const sql_create_shelter = "SELECT * FROM shelterentries WHERE entryid = ?";
  //     const values = [
  //       [entryid]
  //     ];
  //     mydb.getConnection().awaitQuery(sql_create_shelter, [values])
  //       .then((result) => {
  //         resolve(result);
  //       })
  //       // .catch((err) => {
  //       //   reject(err);
  //       // });
  //   });
  // }

  static findCompatibleShelters(partySize, petAccom, disAccom) {//search by occupancy and accomodations
    return new Promise((resolve, reject) => {
      const sql_query_shelter = "SELECT * FROM shelterentries WHERE occupancy >= ? AND petfriendly >= ? AND disfriendly >= ? ORDER BY occupancy, residencetype";
      const values = [partySize, petAccom, disAccom];
      mydb
        .getConnection()
        .awaitQuery(sql_query_shelter, values)
        .then((result) => {
          resolve(result);
        })
        // .catch((err) => {
        //   reject(err);
        // });
    });
  }

  static findOwnShelter(providername) {//search by providername = localstorage.get(username)
    return new Promise((resolve, reject) => {
      const sql_query_shelter = "SELECT * FROM shelterentries WHERE providername = ?";
      const values = [providername];
      mydb
        .getConnection()
        .awaitQuery(sql_query_shelter, values)
        .then((result) => {
          resolve(result);
        })
        // .catch((err) => {
        //   reject(err);
        // });
    });
  }

  static delOwnShelter(providername) {
    return new Promise((resolve, reject) => {
      const sql_query_shelter = "DELETE FROM shelterentries WHERE providername = ?";
      const values = [providername];
      mydb
        .getConnection()
        .awaitQuery(sql_query_shelter, values)
        .then((result) => {
          resolve(result);
        })
        // .catch((err) => {
        //   reject(err);
        // });
    });
  }

}

module.exports = Shelter;
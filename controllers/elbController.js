// const ActivityModel = require("../models/activityModel.js");
// const HttpResponse = require("./httpResponse.js");
// const MyQueue = require("../utils/queue.js")

// var q = new MyQueue();
var lock_available = true;
var ticket_id = 0;

async function buyTicket(ms) {
  console.log("controller - buyTicket() called")

  while(true) {
    if (lock_available === true) break;
    await sleep(1);
  }

  lock_available = false;
  await sleep(ms);
  ticket_id++;
  lock_available = true;
  return {
    "ticket_id": ticket_id
  };
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = {
  buyTicket: buyTicket
};

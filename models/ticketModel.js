
const mydb = require('../utils/database.js');
const awsElasticache = require("../utils/awsElasticache");
const awsElasticacheService = new awsElasticache();

class TicketModel {
    constructor() {
      if (!TicketModel._instance) {
        TicketModel._instance = this;
        this.simulate_seconds = 2;
      }

      return TicketModel._instance;        
    }

    
    get_agenda_by_agenda_provider(agendaProvider) {
      return new Promise(async (resolve, reject) => {

        // simulate long-running sql query
        const sql_wait = this.get_wait_sql(this.simulate_seconds);
        await mydb.getConnection().awaitQuery(sql_wait);
        // execute sql query 
        const sql = this.get_agenda_by_agenda_provider_sql(agendaProvider); 
        const values = []; // const values = [[id]];
        const result = await mydb.getConnection().awaitQuery(sql, values);
        resolve(result);

      })
    }        
    
    // ex. iThome 雲端大會
    get_agenda_by_agenda_provider_sql(agendaProvider) {
      const sql = 
      `
      SELECT *
      FROM ticketsystem.agenda
      WHERE agenda_type LIKE '${agendaProvider}'
      ;
      `
      return sql;
    }

    get_insert_bought_ticket(agendaProvider) {
      return new Promise(async (resolve, reject) => {

        // simulate long-running sql query
        // const sql_wait = this.get_wait_sql(this.simulate_seconds);
        // await mydb.getConnection().awaitQuery(sql_wait);
        // execute sql query 
        const sql = this.get_insert_bought_ticket_sql(agendaProvider); 
        const values = []; // const values = [[id]];
        const result = await mydb.getConnection().awaitQuery(sql, values);
        resolve(result);

      })
    }     

    get_insert_bought_ticket_sql(agendaProvider) {
      const sql = 
      `
      INSERT INTO ticket (ticket_type) 
      VALUES ('${agendaProvider}')
      ;
      `
      return sql;
    }


    get_wait_sql(seconds) {
      const sql = 
      `
      do sleep(${seconds});
      `
      return sql;
    }            

}
module.exports = TicketModel;


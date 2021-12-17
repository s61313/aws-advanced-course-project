
const mydb = require('../utils/database.js');
const awsElasticache = require("../utils/awsElasticache");
const awsElasticacheService = new awsElasticache();

class EmpModel {
    constructor() {
      if (!EmpModel._instance) {
        EmpModel._instance = this;
        this.simulate_seconds = 1;
      }

      return EmpModel._instance;        
    }

    
    get_employee_by_id(emp_no) {
      return new Promise(async (resolve, reject) => {

        // simulate long-running sql query
        const sql_wait = this.get_wait_sql(this.simulate_seconds);
        await mydb.getConnection().awaitQuery(sql_wait);
        // execute sql query 
        const sql = this.get_employee_by_id_sql(emp_no); 
        const values = []; // const values = [[id]];
        const result = await mydb.getConnection().awaitQuery(sql, values);
        resolve(result);

      })
    }        

    list_employee() {
      return new Promise(async (resolve, reject) => {

        // simulate long-running sql query
        const sql_wait = this.get_wait_sql(this.simulate_seconds);
        await mydb.getConnection().awaitQuery(sql_wait);
        // execute sql query 
        const sql = this.get_list_employee_sql(); 
        const values = []; // const values = [[id]];
        const result = await mydb.getConnection().awaitQuery(sql, values);
        resolve(result);

      })
    }      
    
    
    get_employee_by_id_sql(emp_no_to_find) {
      const sql = 
      `
      SELECT e.emp_no, e.first_name, e.last_name, d.dept_name, dm.mgr_no, dm.mgr_first_name, dm.mgr_last_name
      FROM employees e
      LEFT JOIN dept_emp de ON e.emp_no = de.emp_no AND de.to_date = '9999-01-01'
      LEFT JOIN departments d ON de.dept_no = d.dept_no
      LEFT JOIN (
        SELECT dm2.emp_no as 'mgr_no', e2.first_name as 'mgr_first_name', e2.last_name as 'mgr_last_name', dm2.dept_no
          FROM dept_manager dm2 
          LEFT JOIN employees e2 ON dm2.emp_no = e2.emp_no
          WHERE dm2.to_date = '9999-01-01'
      ) dm ON dm.dept_no = d.dept_no
      WHERE e.emp_no != dm.mgr_no AND e.emp_no = ${emp_no_to_find}
      ORDER BY e.emp_no
      LIMIT 100;
      `
      return sql;
    }      

    get_list_employee_sql() {
      const sql = 
      `
      SELECT e.emp_no, e.first_name, e.last_name, d.dept_name, dm.mgr_no, dm.mgr_first_name, dm.mgr_last_name
      FROM employees e
      LEFT JOIN dept_emp de ON e.emp_no = de.emp_no AND de.to_date = '9999-01-01'
      LEFT JOIN departments d ON de.dept_no = d.dept_no
      LEFT JOIN (
        SELECT dm2.emp_no as 'mgr_no', e2.first_name as 'mgr_first_name', e2.last_name as 'mgr_last_name', dm2.dept_no
          FROM dept_manager dm2 
          LEFT JOIN employees e2 ON dm2.emp_no = e2.emp_no
          WHERE dm2.to_date = '9999-01-01'
      ) dm ON dm.dept_no = d.dept_no
      WHERE e.emp_no != dm.mgr_no
      ORDER BY e.emp_no
      LIMIT 100;
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
module.exports = EmpModel;


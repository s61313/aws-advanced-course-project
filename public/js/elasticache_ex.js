/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var rows_per_page = 500;

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

function clearData() {
}

function setUpDefault() {
  $('#backendUrlId').val('http://ec2-3-94-53-228.compute-1.amazonaws.com:8080')
  $('#empNameId').val('George');
  $('#mgrNameId').val('Oscar');
  
  // $('#sqsQueueUrlId').val('https://sqs.us-east-1.amazonaws.com/344458213649/sqs-asg-001')
}

function setupEvent(){
  
  $('#getEmpInfoId').click({"input1": "value1"}, getEmpInfo);
  $('#cleanCacheId').click({"input1": "value1"}, cleanCache);
  $('#clearListId').click({"input1": "value1"}, clearList);
  $('#simulation01Id').click({"input1": "value1"}, simulation01);

  

}

async function simulation01(){
  console.log("simulation01() called");
  $('#simulation01Id').prop('disabled', true);
  await simulation01Helper();
  $('#simulation01Id').prop('disabled', false);
}


async function getEmpInfo(){
  console.log("getEmpInfo() called");
  $('#getEmpInfoId').prop('disabled', true);
  await getEmpInfoHelper();
  $('#getEmpInfoId').prop('disabled', false);
}

async function clearList(){
  console.log("clearList() called");
  $('#clearList').prop('disabled', true);
  await cleanCacheHelper();
  $('#clearList').prop('disabled', false);
}

async function cleanCache(){
  console.log("cleanCache() called");
  $('#cleanCache').prop('disabled', true);
  await cleanCache_helper();
  $('#cleanCache').prop('disabled', false);
}

async function listEmployeeWithEcache(){
  console.log("listEmployeeWithEcache() called");
  $("#empListId").html("");
  $('#listEmployeeWithEcacheId').prop('disabled', true);
  const res = await list_employee_helper(true);
  $("#listEmployeeWithEcacheId").html(`List Employees + ElastiCache (${res.processed_time}s)`);
  $('#listEmployeeWithEcacheId').prop('disabled', false);
}


async function list_employee(){
  console.log("list_employee() called");
  $("#empListId").html("");
  $('#listEmployeeId').prop('disabled', true);
  const res = await list_employee_helper(false);
  $("#listEmployeeId").html(`List Employees (${res.processed_time}s)`);
  $('#listEmployeeId').prop('disabled', false);
}


function simulation01Helper() {

  return new Promise(async (resolve, reject) => {
    console.log("simulation01Helper() called");
    let namesList = getTestNamesList();

    for (var i = 0; i < namesList.length; i++) {
      let names = namesList[i];
      let get_employee_api_result = await get_employee_api(names.empName, names.mgrName);
      if (get_employee_api_result != "OK") {
        break;
      }
    }

    resolve();

  })   

}

function get_employee_api(empName, mgrName) {
  return new Promise(async (resolve, reject) => {

    let hostname = $('#backendUrlId').val();
    var url_get_employee = `${hostname}/api/elasticache/get_employee?empName=${empName}&mgrName=${mgrName}`;
    console.log("url_get_employee_2: " , url_get_employee);

    $.ajax({
      url: url_get_employee,
      type: "GET",
      success: function (res) {
        console.log("get_employee_api - res: " , res);   
        // DOTHIS: is wrong cached data, show red something
        appendEmployeeRows(res.result);     
        resolve("OK");
      },
    });
  })
}

function getTestNamesList() {
  var namesList = [];
  namesList.push({empName: 'George',mgrName: 'Oscar'});
  return namesList;
}

function getEmpInfoHelper() {

  return new Promise(async (resolve, reject) => {
    console.log("getEmpInfoHelper() called");
    let hostname = $('#backendUrlId').val();
    let empName = $('#empNameId').val();
    let mgrName = $('#mgrNameId').val();
  
    var url_get_employee = `${hostname}/api/elasticache/get_employee?empName=${empName}&mgrName=${mgrName}`;
    console.log("url_get_employee: " , url_get_employee);
  
    $.ajax({
      url: url_get_employee,
      type: "GET",
      success: function (res) {
        console.log("url_get_employee - res: " , res);   
        appendEmployeeRows(res.result);     
        resolve();
      },
    });
  })   

}


function cleanCacheHelper() {

  return new Promise(async (resolve, reject) => {
    $("#empListId").html("");
    resolve();
  })   

}

function cleanCache_helper() {

  return new Promise(async (resolve, reject) => {
    console.log("cleanCache_helper() called");
    let hostname = $('#backendUrlId').val()
  
    var url_elasticache_clean = `${hostname}/api/elasticache/clean`;
    console.log("url_elasticache_clean: " , url_elasticache_clean);
  
    $.ajax({
      url: url_elasticache_clean,
      type: "GET",
      success: function (res) {
        console.log("url_elasticache_clean - res: " , res);    
        resolve();
      },
    });
  })   

}

function list_employee_helper(is_cache) {

  return new Promise(async (resolve, reject) => {
    console.log("list_employee_helper() called");
    let hostname = $('#backendUrlId').val()
    
    var url_elasticache_list_employee;
    if (is_cache) {
      url_elasticache_list_employee = `${hostname}/api/elasticache/list_employee_cached`;
    }else {
      url_elasticache_list_employee = `${hostname}/api/elasticache/list_employee`;
    }
    
    console.log("url_elasticache_list_employee: " , url_elasticache_list_employee);
  
    $.ajax({
      url: url_elasticache_list_employee,
      type: "GET",
      success: function (res) {
        console.log("url_elasticache_list_employee - res: " , res);
        appendEmployeeRows(res.result);
        resolve(res);
      },
    });
  })   

}

function appendEmployeeRows(emp_list) {
  $("#empListId").html("");
  var rows_min = Math.min(rows_per_page, emp_list.length);
  for (var i = 0; i < rows_min ;i++) {
    const emp = emp_list[i];
    $("#empListId").append(getEmployeeRowView(emp.emp_no, emp.first_name, emp.last_name, emp.dept_name, emp.mgr_first_name, emp.mgr_last_name));
  }
} 

function getEmployeeRowView(emp_no, first_name, last_name, dept_name, mgr_first_name, mgr_last_name) {
  return  `
          <tr id="${emp_no}">
          <td>${emp_no}</td>
          <td>${first_name} ${last_name}</td>
          <td>${dept_name}</td>
          <td>${mgr_first_name} ${mgr_last_name}</td>
          </tr>
          `
}
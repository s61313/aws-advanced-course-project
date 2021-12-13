/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

function clearData() {
}

function setUpDefault() {
  $('#backendUrlId').val('http://localhost:8080')
  // $('#sqsQueueUrlId').val('https://sqs.us-east-1.amazonaws.com/344458213649/sqs-asg-001')
}

function setupEvent(){
  
  $('#listEmployeeId').click({"input1": "value1"}, list_employee);
  // $('#caseBasicStopId').click({"input1": "value1"}, end_basic_simulation);

  // $('#caseNormalDemandId').click({"input1": "value1"}, start_normal_demand_simulation);
  // $('#caseNormalDemandStopId').click({"input1": "value1"}, end_normal_demand_simulation);

  // $('#caseHighDemandId').click({"input1": "value1"}, start_high_demand_simulation);
  // $('#caseHighDemandStopId').click({"input1": "value1"}, end_high_demand_simulation);

}

async function list_employee(){
  console.log("list_employee() called");
  $('#listEmployeeId').prop('disabled', true);
  await list_employee_helper();
}

function list_employee_helper() {

  return new Promise(async (resolve, reject) => {
    console.log("list_employee_helper() called");
    let hostname = $('#backendUrlId').val()
  
    var url_elasticache_list_employee = `${hostname}/api/elasticache/list_employee`;
    console.log("url_elasticache_list_employee: " , url_elasticache_list_employee);
  
    $.ajax({
      url: url_elasticache_list_employee,
      type: "GET",
      success: function (res) {
        console.log("url_elasticache_list_employee - res: " , res);
        appendEmployeeRows(res.result);
        $("#listEmployeeId").html(`List Employees (${res.processed_time}s)`);
        $('#listEmployeeId').prop('disabled', false);
        resolve();
      },
    });
  })   

}

function appendEmployeeRows(emp_list) {
  $("#empListId").html("");
  // DO-THIS: limit to show only first 1000 rows  
  for (var i = 0; i < emp_list.length ;i++) {
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
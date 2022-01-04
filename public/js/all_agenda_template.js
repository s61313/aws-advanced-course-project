/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";
var rows_per_page = 500;
var processed_time_total = 0;
var cached_checker = new Set();

const backend_url = "${BACKEND_HOST_URL}";  
// const backend_url = "http://localhost:8080";
const resource_url = "${CF_RESOURCE_HOST_URL}"; 
// const resource_url = "http://localhost:8080";

$(document).ready(() => {
  console.log("all_homepage.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

async function clearData() {
}

function setUpDefault() {
  // getBanners();
  // $('#backendUrlId').val('http://localhost:8080')
}

function setupEvent(){  
  // $('#getVideoId').click({"input1": "value1"}, getVideo);
  $('#getAgendaId').click({"input1": "value1"}, getAdenda);

  $('#goToBuyTicketPageId').click({"input1": "value1"}, goToBuyTicketPage);

  $('#cleanAgendaCacheId').click({"input1": "value1"}, cleanAgendaCache);
  
}

function goToBuyTicketPage() {
  window.location.pathname = '/all_buy_ticket';
}


async function cleanAgendaCache() {

  return new Promise(async (resolve, reject) => {
    console.log("cleanAgendaCache() called");
    $("#agendaId").html("");
    var url_cleanall = `${backend_url}/api/all/cleanall`;
    console.log("url_cleanall: " , url_cleanall);
  
    $.ajax({
      url: url_cleanall,
      type: "GET",
      success: function (res) {
        console.log("url_cleanall - res: " , res);
        resolve();
      },
    });
  })   

}

async function getAdenda() {

  return new Promise(async (resolve, reject) => {
    console.log("getAdenda() called");
    $("#agendaId").html("");
    let agendaProvider = $('#agendaProvider').val();

    // var agenda_list_tmp = [];
    // if (agendaProvider == "ithome") {
    //   agenda_list_tmp.push({startendtime: "09:00-10:00", topic: "雲端的趨勢", speaker: "Tom Cruise"});
    //   agenda_list_tmp.push({startendtime: "10:00-13:00", topic: "AWS 與 GCP 踩雷分享談", speaker: "Kelly Lui"});
    //   agenda_list_tmp.push({startendtime: "13:00-15:00", topic: "雲端工作坊 (需自備筆電)", speaker: "Catherine"});
    //   agenda_list_tmp.push({startendtime: "15:00-16:00", topic: "重定義：雲端運算新常態", speaker: "Matthew"});
    //   // agenda_list_tmp.push({ticket_id: 2, ticket_type: "JCConf", ticket_no_remained: 23});
    //   // agenda_list_tmp.push({ticket_id: 3, ticket_type: "JSDC", ticket_no_remained: 10});
    //   // agenda_list_tmp.push({ticket_id: 4, ticket_type: "開發者年會", ticket_no_remained: 66});  
    // }
    // appendAgendaRows(agenda_list_tmp);
    // resolve();
    
    var url_get_agenda = `${backend_url}/api/all/agenda?agendaProvider=${agendaProvider}`;
    console.log("url_get_agenda: " , url_get_agenda);
  
    $.ajax({
      url: url_get_agenda,
      type: "GET",
      success: function (res) {
        console.log("url_get_agenda - res: " , res);
        appendAgendaRows(res.result);
        resolve();
      },
    });
  })   

}

function appendAgendaRows(agenda_list) {
  $("#agendaId").html("");
  for (var i = 0; i < agenda_list.length ;i++) {
    const agenda = agenda_list[i];
    $("#agendaId").append(getAgendaRowView(agenda.agenda_startendtime, agenda.agenda_topic, agenda.agenda_speaker));
  }
} 

function getAgendaRowView(startendtime, topic, speaker) {
  return  `
          <tr>
          <td>${startendtime}</td>
          <td>${topic}</td>
          <td>${speaker}</td>
          </tr>
          `
}
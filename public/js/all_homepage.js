/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";
var rows_per_page = 500;
var processed_time_total = 0;
var cached_checker = new Set();

// const backend_url = "${BACKEND_HOST_URL}"; // DO-THIS: use it for formal env 
const backend_url = "http://localhost:8080";
// const resource_url = "${RESOURCE_HOST_URL}"; // DO-THIS: use it for formal env 
const resource_url = "https://dq4qybh1c4o5p.cloudfront.net";
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
  getBanners();
  // $('#backendUrlId').val('http://localhost:8080')
}

function setupEvent(){  
  // $('#getVideoId').click({"input1": "value1"}, getVideo);

  $('#goToSeeAgendaPageId').click({"input1": "value1"}, goToSeeAgendaPage);
  $('#goToBuyTicketPageId').click({"input1": "value1"}, goToBuyTicketPage);
  
}

function goToBuyTicketPage() {
  window.location.pathname = '/all_buy_ticket';
  // window.location.href = "http://www.w3schools.com";
}

function goToSeeAgendaPage() {
  window.location.pathname = '/all_agenda';
  // window.location.href = "http://www.w3schools.com";
}

async function getBanners(){

  // DO-THIS: get the best two

  const banner_filepath_one = get_banner_filepath_one();
  const banner_filepath_two = get_banner_filepath_two();
  
  const banner_one = resource_url + "/" + banner_filepath_one;
  const banner_two = resource_url + "/" + banner_filepath_two;
  
  $('#bannersId').html("");
  $('#bannersId').append(`<img src=${banner_one} class="col-6">`);       
  $('#bannersId').append(`<img src=${banner_two} class="col-6">`);       
  $('#bannersId')[0].load(); 

}

function get_banner_filepath_one() {
  return "banner_jcconf.png"; // DO-THIS: call api to get it 
}

function get_banner_filepath_two() {
  return "banner_jsdc.png"; // DO-THIS: call api to get it 
}


// function getVideoHelper() {
//   return new Promise(async (resolve, reject) => {

//     let hostname = $('#backendUrlId').val();
//     let videopath = '/aws_cloudfront_gcp_vpc_zh.mp4';
//     let studentstatus = $('#studentstatus').find(":selected").val();
//     var url_get_video = `${hostname}/api/cloudfront/coursevideo?videopath=${videopath}&studentstatus=${studentstatus}`;
//     console.log("url_get_video: " , url_get_video);

//     $.ajax({
//       url: url_get_video,
//       type: "GET",
//       success: function (res) {
//         console.log("url_get_video - res: " , res);   
//         if (res) {
//           // appendEmployeeRows(res.result);     
//           $('#videoSrcId').html("");
//           $('#videoSrcId').append(`<source src=${res.result.signedUrl} type="video/mp4">`);       
//           $('#videoSrcId')[0].load(); 
//         }else {
//           console.log("unauthorized content");
//           $('#videoSrcId').html("");
//           $('#videoSrcId')[0].load(); 
//           $("#getVideoId").html(`Get Video by Signed URL (Unauthorized Content)`);  
//           $("#getVideoId").css("background-color", notpassed_toolong_color_bg);  
//         }
//         resolve();
//       },
//     });
//   })
// }

/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";
var rows_per_page = 500;
var processed_time_total = 0;
var cached_checker = new Set();
var cf_distribution_dns = "https://mycf7.learncodebypicture.com"
let videourlall = `${cf_distribution_dns}/aws_cloudfront_gcp_vpc_zh.mp4`;
// const hostname = "${BACKEND_HOST_URL}";


$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

async function clearData() {
}

function setUpDefault() {
  $('#backendUrlId').val('http://localhost:8080')
}

function setupEvent(){  
  $('#getVideoId').click({"input1": "value1"}, getVideoBySignedUrl);
  $('#getVideoSignedCookieId').click({"input1": "value1"}, getVideoSignedCookie); 
  $('#getVideoBySignedCookieId').click({"input1": "value1"}, getVideoBySignedCookie); 

}

async function getVideoBySignedCookie(){
  console.log("getVideoBySignedCookie() called");
  $('#getVideoBySignedCookieId').prop('disabled', true);
  $("#getVideoBySignedCookieId").html(`Get Video by Signed Cookie`);
  await getVideoBySignedCookieHelper();  
  $('#getVideoBySignedCookieId').prop('disabled', false);
}

async function getVideoSignedCookie(){
  console.log("getVideoSignedCookie() called");
  $('#getVideoSignedCookieId').prop('disabled', true);
  $("#getVideoSignedCookieId").html(`Get Video (Signed Cookie)`);
  await getVideoSignedCookieHelper();  
  $('#getVideoSignedCookieId').prop('disabled', false);
}

async function getVideoBySignedUrl(){
  console.log("getVideoBySignedUrl() called");
  $('#getVideoId').prop('disabled', true);
  $("#getVideoId").html(`Get Video`);
  // $("#simulation01Id").css("background-color", color_bg_default); 
  await getVideoBySignedUrlHelper();  
  $('#getVideoId').prop('disabled', false);
}



function getVideoBySignedCookieHelper() {
  return new Promise(async (resolve, reject) => {
    
    // $('#videoSrcId')[0].load(); 

    let policy = getCookie('CloudFront-Policy');
    let signature = getCookie('CloudFront-Signature');
    let keyPairId = getCookie('CloudFront-Key-Pair-Id');
    // let videourlByCookie = `${videourlall}?Policy=${policy}&Signature=${signature}&Key-Pair-Id=${keyPairId}`;
    let videourlByCookie = `${videourlall}`;
    console.log("videourlByCookie: ", videourlByCookie);
    $('#videoSrcId').html("");
    $('#videoSrcId').append(`<source src=${videourlByCookie} type="video/mp4">`);    
    $('#videoSrcId')[0].load();    
    resolve();

    // let videourl = `${cf_distribution_dns}/aws_cloudfront_gcp_vpc_zh.mp4`;
    // console.log("videourl: " , videourl);

    // $.ajax({
    //   url: videourl,
    //   type: "GET",
    //   xhrFields: {
    //     withCredentials: true
    //   },
    //   success: function (res) {
    //     console.log("videourl - res: " , res);   
    //     // appendEmployeeRows(res.result);     
    //     // $('#videoSrcId').html("");
    //     // $('#videoSrcId').append(`<source src=${res.result.signedUrl} type="video/mp4">`);       
    //     // $('#videoSrcId')[0].load(); 
    //     resolve();
    //   },
    // });

  })
}


function getVideoSignedCookieHelper() {
  return new Promise(async (resolve, reject) => {

    let hostname = 'http://mycf7.learncodebypicture.com';
    // let videourl = $('#videourl').val();
    // let distribution_dns = `${cf_distribution_dns}/*`;
    var url_get_video = `${hostname}/api/cloudfront/coursevideo/signedcookie`;
    console.log("url_get_video: " , url_get_video);

    $.ajax({
      url: url_get_video,
      type: "GET",
      success: function (res) {
        console.log("url_get_video - res: " , res);   
        const cookies_to_add = res.cookies;
        for (let i = 0; i < cookies_to_add.length; i++) {
          const cookie_to_add = cookies_to_add[i];
          createCookie(cookie_to_add.key, cookie_to_add.val, 1);
        }
        // appendEmployeeRows(res.result);     
        // $('#videoSrcId').html("");
        // $('#videoSrcId').append(`<source src=${res.result.signedUrl} type="video/mp4">`);       
        // $('#videoSrcId')[0].load(); 
        resolve();
      },
    });
  })
}

function getVideoBySignedUrlHelper() {
  return new Promise(async (resolve, reject) => {

    let hostname = $('#backendUrlId').val();
    // let videourl = $('#videourl').val();
    let videourl = `${cf_distribution_dns}/aws_cloudfront_gcp_vpc_zh.mp4`;
    var url_get_video = `${hostname}/api/cloudfront/coursevideo?videourl=${videourl}`;
    console.log("url_get_video: " , url_get_video);

    $.ajax({
      url: url_get_video,
      type: "GET",
      success: function (res) {
        console.log("url_get_video - res: " , res);   
        // appendEmployeeRows(res.result);     
        $('#videoSrcId').html("");
        $('#videoSrcId').append(`<source src=${res.result.signedUrl} type="video/mp4">`);       
        $('#videoSrcId')[0].load(); 
        resolve();
      },
    });
  })
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function createCookie(name, value, days) {
  var expires;
  if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
  }
  else {
      expires = "";
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

// function getCookie(c_name) {
//   if (document.cookie.length > 0) {
//       c_start = document.cookie.indexOf(c_name + "=");
//       if (c_start != -1) {
//           c_start = c_start + c_name.length + 1;
//           c_end = document.cookie.indexOf(";", c_start);
//           if (c_end == -1) {
//               c_end = document.cookie.length;
//           }
//           return unescape(document.cookie.substring(c_start, c_end));
//       }
//   }
//   return "";
// }

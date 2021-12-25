/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";

$(document).ready(() => {
  console.log("sqs_lambda_tempalte.js loaded");
  setUpDefault();
  setupEvent();
  clearData();
});

async function clearData() {  
}

function setUpDefault() {
  $('#backendUrlId').val('https://mycf11.learncodebypicture.com');
}

function setupEvent(){  
  $('#getSignedCookieId').click({"input1": "value1"}, getSignedCookie); 
  $('#getVideoBySignedCookie2Id').click({"input1": "value1"}, getVideoBySignedCookie2);  
}


async function getVideoBySignedCookie2(){
  console.log("getVideoBySignedCookie2() called");
  $('#getVideoBySignedCookie2Id').prop('disabled', true);
  $("#getVideoBySignedCookie2Id").html(`Get Video by Signed Cookie`);
  await getVideoBySignedCookie2Helper();  
  $('#getVideoBySignedCookie2Id').prop('disabled', false);
}

async function getSignedCookie(){
  console.log("getSignedCookie() called");
  $('#getSignedCookieId').prop('disabled', true);
  $("#getSignedCookieId").html(`Get Signed Cookie`);
  await getSignedCookieHelper();  
  $('#getSignedCookieId').prop('disabled', false);
}

function getVideoBySignedCookie2Helper() {
  return new Promise(async (resolve, reject) => {
    console.log("getVideoBySignedCookie2Helper() called");
    let hostname = $('#backendUrlId').val();
    let videopath = '/production/aws_cloudfront_gcp_vpc_zh.mp4';
    let videourl = hostname + videopath;
    console.log("videourl: ", videourl);

    $('#videoSrcId').html("");
    $('#videoSrcId').append(`<source src=${videourl} type="video/mp4">`);    
    $('#videoSrcId')[0].load();    
    resolve();

  })
}

function getSignedCookieHelper() {
  return new Promise(async (resolve, reject) => {

    let hostname = $('#backendUrlId').val();
    var url_get_video = `${hostname}/api/cloudfront/coursevideo/signedcookie`;
    console.log("url_get_video: " , url_get_video);

    $.ajax({
      url: url_get_video,
      type: "GET",
      success: function (res) {
        console.log("url_get_video - res: " , res);   
        const cookie_array = res.cookie_array;
        console.log("cookie_array: ", cookie_array);
        for (let i = 0; i < cookie_array.length; i++) {
          const cookie_to_add = cookie_array[i]; 
          const key = cookie_to_add.key;
          const val = cookie_to_add.val;
          const domain = '.learncodebypicture.com';
          const expire = new Date().getTime() + 86400000;
          const cookie_str = `${key}=${val};expires=${expire};domain=${domain};path=/`;
          console.log("cookie_str: ", cookie_str);
          document.cookie = cookie_str;
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

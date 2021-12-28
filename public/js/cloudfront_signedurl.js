/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";
var rows_per_page = 500;
var processed_time_total = 0;
var cached_checker = new Set();
// const hostname = "${BACKEND_HOST_URL}";

$(document).ready(() => {
  console.log("cloudfront_signedurl.js loaded");
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
  $('#getVideoId').click({"input1": "value1"}, getVideo);
}

async function getVideo(){
  console.log("getVideo() called");
  $('#getVideoId').prop('disabled', true);
  $("#getVideoId").html(`Get Video by Signed URL`);  
  $("#getVideoId").css("background-color", color_bg_default);    
  await getVideoHelper();  
  $('#getVideoId').prop('disabled', false);
}

function getVideoHelper() {
  return new Promise(async (resolve, reject) => {

    let hostname = $('#backendUrlId').val();
    let videopath = '/aws_cloudfront_gcp_vpc_zh.mp4';
    let studentstatus = $('#studentstatus').find(":selected").val();
    var url_get_video = `${hostname}/api/cloudfront/coursevideo?videopath=${videopath}&studentstatus=${studentstatus}`;
    console.log("url_get_video: " , url_get_video);

    $.ajax({
      url: url_get_video,
      type: "GET",
      success: function (res) {
        console.log("url_get_video - res: " , res);   
        if (res) {
          // appendEmployeeRows(res.result);     
          $('#videoSrcId').html("");
          $('#videoSrcId').append(`<source src=${res.result.signedUrl} type="video/mp4">`);       
          $('#videoSrcId')[0].load(); 
        }else {
          console.log("unauthorized content");
          $('#videoSrcId').html("");
          $('#videoSrcId')[0].load(); 
          $("#getVideoId").html(`Get Video by Signed URL (Unauthorized Content)`);  
          $("#getVideoId").css("background-color", notpassed_toolong_color_bg);  
        }
        resolve();
      },
    });
  })
}

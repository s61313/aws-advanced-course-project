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
  $('#getVideoId').click({"input1": "value1"}, getVideo);
}


async function getVideo(){
  console.log("getVideo() called");
  $('#getVideo').prop('disabled', true);
  $("#getVideo").html(`Get Video`);
  // $("#simulation01Id").css("background-color", color_bg_default); 
  await getVideoHelper();  
  $('#simulation01Id').prop('disabled', false);
}

function getVideoHelper() {
  return new Promise(async (resolve, reject) => {

    let hostname = $('#backendUrlId').val();
    // let videourl = $('#videourl').val();
    let videourl = 'https://d33eam7xngdn67.cloudfront.net/aws_cloudfront_gcp_vpc_zh.mp4';
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

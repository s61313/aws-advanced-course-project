/// <reference types="aws-sdk" />
// import AWS from 'aws-sdk';

var notpassed_color_bg = "rgb(88, 124, 171)";
var passed_color_bg = "#22a2b8";
var notpassed_toolong_color_bg = "rgb(191, 62, 92)";
var color_bg_default = "rgb(36, 48, 64)";
var rows_per_page = 500;
var processed_time_total = 0;
var cached_checker = new Set();
var cf_distribution_dns = "http://mycf11.learncodebypicture.com"
let videourlall = `${cf_distribution_dns}/production/aws_cloudfront_gcp_vpc_zh.mp4`;
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
  $('#generateArticleId').click({"input1": "value1"}, generateArticle);

  $('#generateArticleDDoSId').click({"input1": "value1"}, generateArticleDDoS);
  
}


async function generateArticleDDoS(){
  console.log("generateArticleDDoS() called");
  $('#generateArticleDDoSId').prop('disabled', true);
  $("#generateArticleDDoSId").html(`Generate Article`);
  let round = 101;
  for (;round >= 0; round--) {
    await generateArticleHelper(uuidv4()); 
  }
  $('#generateArticleDDoSId').prop('disabled', false);
}


async function generateArticle(){
  console.log("generateArticle() called");
  $('#generateArticleId').prop('disabled', true);
  $("#generateArticleId").html(`Generate Article`);
  $('#articleId').html('');
  // $("#simulation01Id").css("background-color", color_bg_default); 
  await generateArticleHelper();  
  $('#generateArticleId').prop('disabled', false);
}

function generateArticleHelper(random_suffix) {
  return new Promise(async (resolve, reject) => {

    let hostname = $('#backendUrlId').val();
    let userName = $('#userNameId').val();
    var url_generate_article = '';
    if (random_suffix) {
      url_generate_article = `${hostname}/api/cloudfront/generatearticle?creator=${userName}_${random_suffix}`;
    }else {
      url_generate_article = `${hostname}/api/cloudfront/generatearticle?creator=${userName}`;
    }
    
    console.log("url_generate_article: " , url_generate_article);

    $.ajax({
      url: url_generate_article,
      type: "GET",
      success: function (res) {
        console.log("url_generate_article - res: " , res);   
        $('#articleId').html(res.result);
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

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
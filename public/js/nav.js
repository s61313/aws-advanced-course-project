const increaseBy = 10;
var loadMoreClickCount = 0;
var SearchResultData = [];
const title = $('title').text();

$(document).ready(() => {
  const username = sessionStorage.getItem('username');
  checkUnreadmsgForInboxBtn(username);
  $("#nav-template").append(getNavbar());
  $(".logout-btn").on("click", (e) => {
    logout(sessionStorage.getItem("username"));
  });

  if (title === "Private Messages") {
    $("#search-icon").hide();
  }
  else {
    $("#search-box-view").append(getSearchBox(title));
    $("#search-more-btn").hide();
    $("#search-icon").click((e) => {
      $("#search-box").modal("show");
    });

    if (title === "ESN") {
      $("#status-search-btn").click((e) => {
        $("#searchResult").empty();
        getSearchResultForESN("status");
  
      });
      $("#name-search-btn").click((e) => {
        $("#searchResult").empty();
        getSearchResultForESN("name");
      });
    }else {
      $("#search-btn").click((e) => {
          $("#searchResult").empty();
          $("#search-more-btn").hide();
          loadMoreClickCount = 1;
          SearchResultData = [];
          getSearchResult(title);
      });
      $("#search-more-btn").click((e) => {
        $("#searchResult").empty();
        loadMoreClickCount++;
        printSearchResult(title);
      });
    }
  }





});


/** Private chat search */
function getSearchResultForPrivateChat(keywords) {
  const username = sessionStorage.getItem("username");
  const talkingToUsername = sessionStorage.getItem("talkingToUsername");
  if (keywords.toLowerCase() === 'status') {
    sessionStorage.setItem("privateChatSearchTopic", "status");
    return getStatusHistory(talkingToUsername);
  } else {
    sessionStorage.setItem("privateChatSearchTopic", "message");
    return getPrivateChatHistory(username, talkingToUsername, keywords);
  }
}

function getPrivateChatHistory(username, talkingToUsername, keywords) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/messages/private/${username}/${talkingToUsername}?keywords=${keywords}`,
      type: "GET",
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function getStatusHistory(username) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/status/${username}`,
      type: "GET",
      success: function (res) {
        console.log(res);
        resolve(res);
      },
    });
  });
}

function printPrivateChatSearchResults(result) {
  const { data, resCode } = result;
  if (resCode === "StopWordsOnly") {
    $("#searchResult").append(`<p style="font-size:smaller;">Warning: Only StopWords Found. Please try again.</p>`);
  } else {
    SearchResultData = data;
    if (SearchResultData.length > increaseBy) {
      $("#search-more-btn").show();
    }
    printPrivateChatSearchResultsHelper(SearchResultData);
  }
}

function printPrivateChatSearchResultsHelper(searchResult) {
  const searchTopic = sessionStorage.getItem("privateChatSearchTopic");
  if (searchTopic === "status") {
    printStatusHistory(searchResult);
  } else {
    printPrivateChatMessages(searchResult);
  }
  if (loadMoreClickCount * increaseBy >= searchResult.length) {
    $("#search-more-btn").hide();
  }
  $('#search-box').modal('handleUpdate');
}

function printPrivateChatMessages(searchResult) {
  for (var i = 0; i < searchResult.length && i < loadMoreClickCount * increaseBy; i++) {
    const senderStatus =
      searchResult[i].senderStatus === "null" ||
        searchResult[i].senderStatus === ""
        ? "UNDEFINED"
        : searchResult[i].senderStatus;
    const searchResultView = `<div class="md-form mb-3">
                                <div style="font-size: x-small; color:grey; padding-left: 10px"> ${searchResult[i].senderName} [${senderStatus}] ${searchResult[i].ts} </div>
                                <div style="font-size: smaller; padding-left: 10px"><span> ${searchResult[i].content} </span></div>
                              </div>`;
    $("#searchResult").append(searchResultView);
  }
}

function printStatusHistory(searchResult) {
  for (var i = 0; i < searchResult.length && i < loadMoreClickCount * increaseBy; i++
  ) {
    const status = getStatusContent(searchResult[i].status);
    const statusColor = getStatusColor(searchResult[i].status);
    const searchResultView = `<div class="md-form mb-3">
                                <div style="font-size: x-small; padding-left: 10px"> ${searchResult[i].username} changed status to <span style="color: ${statusColor}; font-weight:">[${status}]</span> at ${searchResult[i].ts} </div>
                              </div>`;
    $("#searchResult").append(searchResultView);
  }
}

function getStatusContent(status) {
  if (!status) {
    return "UNDEFINED";
  }
  if (status === "1") {
    return "OK";
  }
  if (status === "2") {
    return "HELP";
  }
  if (status === "3") {
    return "EMERGENCY";
  }
}

function getStatusColor(status) {
  if (!status) {
    return "grey";
  }
  if (status === "1") {
    return "green";
  }
  if (status === "2") {
    return "orange";
  }
  if (status === "3") {
    return "red";
  }
}


// End of private chat search



async function getSearchResultForESN(criteria) {

  if (criteria === "status") {
    var Radio;

    if ($('#searchRadio1').is(':checked')) {
      Radio = '1';
    }
    else if ($('#searchRadio2').is(':checked')) {
      Radio = '2';
    }
    else if ($('#searchRadio3').is(':checked')) {
      Radio = '3';
    }
    else {
      Radio = 'ALL';
    }
    console.log('Radio: ' + Radio);
    const result = await getSearchResultForESNByStatus(Radio);
    console.log('result: ' + result);
    printESNSearchByStatusResults(result);
  }
  else if (criteria === "name") {
    const result = await getSearchResultForESNByName($("#keywords").val());
    printESNSearchByNameResults(result);
  }
}

async function getSearchResult(title) {
  const keywords = $("#keywords").val().trim();
  if (keywords === "") {
    $("#searchResult").empty();
    $("#searchResult").append("Please provide keywords");
  } else {
    if (title === "PublicChat") {
      const result = await getSearchResultForPublicChat($("#keywords").val());
      printPublicChatSearchResults(result);
    } else if (title === "PrivateChat") {
      const result = await getSearchResultForPrivateChat($("#keywords").val());
      printPrivateChatSearchResults(result);
    } else if (title === "ESN") {

    }
    else if (title === "Announcement") {
      console.log("Announcement check");
      const result = await getSearchResultForAnnouncement($("#keywords").val());
      printAnnouncementSearchResults(result);
    }
  }
}

//START print[Page]SearchResults--------------------------------------------------------------------
function printPublicChatSearchResults(result) {
  const { data, resCode } = result;
  console.log("getSearchResultForPublicChat data: ", data);
  if (resCode === "StopWordsOnly") {
    $("#searchResult").append(`<p style="font-size:smaller;">Warning: Only StopWords Found. Please try again.</p>`);
  } else {
    SearchResultData = data;
    if (SearchResultData.length > increaseBy) {
      $("#search-more-btn").show();
    }
    printPublicChatSearchResultsHelper(SearchResultData);
  }
}

function printAnnouncementSearchResults(result) {//TODO
  const { data, resCode } = result;
  console.log("getSearchResultForAnnouncement data: ", data);
  if (resCode === "StopWordsOnly") {
    $("#searchResult").append(`<p style="font-size:smaller;">Warning: Only StopWords Found. Please try again.</p>`);
  } else {
    SearchResultData = data;
    if (SearchResultData.length > increaseBy) {
      $("#search-more-btn").show();
    }
    printAnnouncementSearchResultsHelper(SearchResultData);
  }
}

function printESNSearchByNameResults(result) {//TODO
  const { data, resCode } = result;
  console.log("getSearchResultForAnnouncement data: ", data);
  if (resCode === "StopWordsOnly") {
    $("#searchResult").append(`<p style="font-size:smaller;">Warning: Only StopWords Found. Please try again.</p>`);
  } else {
    SearchResultData = data;
    printESNSearchByNameResultsHelper(SearchResultData);
  }
}

function printESNSearchByStatusResults(result) {//TODO
  const { data, resCode } = result;
  console.log("getSearchResultForAnnouncement data: ", data);
  if (resCode === "StopWordsOnly") {
    $("#searchResult").append(`<p style="font-size:smaller;">Warning: Only StopWords Found. Please try again.</p>`);
  } else {
    SearchResultData = data;
    printESNSearchByStatusResultsHelper(SearchResultData);
  }
}

//END print[Page]SearchResults-------------------------------------------------------------------------

function printSearchResult(title) {
  if (title === "PublicChat") {
    printPublicChatSearchResultsHelper(SearchResultData);
  } else if (title === "PrivateChat") {
    printPrivateChatSearchResultsHelper(SearchResultData);

  } else if (title === "Private Messages") {

  } else if (title === "Announcement") {
    printAnnouncementSearchResultsHelper(SearchResultData);
  }
}

//START getSearchResultFor[Page]-----------------------------------------------

function getSearchResultForPublicChat(keywords) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/messages/public?keywords=${keywords}`,
      type: "GET",
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function getSearchResultForAnnouncement(keywords) {//DONE
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/announcement?keywords=${keywords}`,
      type: "GET",
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function getSearchResultForESNByName(keywords) {//DONE
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/users?username=${keywords}`,
      type: "GET",
      success: function (res) {
        resolve(res);
      },
    });
  });
}

function getSearchResultForESNByStatus(status) { //DONE
  return new Promise((resolve, reject) => {
    $.ajax({
      url: `/api/users?status=${status}`,
      type: "GET",
      success: function (res) {
        resolve(res);
      },
    });
  });
}

//END getSearchResultFor[Page]-----------------------------------------------

function printPublicChatSearchResultsHelper(searchResult) {
  for (var i = 0; i < searchResult.length && i < loadMoreClickCount * increaseBy; i++) {
    const senderStatus = (searchResult[i].senderstatus === "null" || searchResult[i].senderstatus === "") ? "UNDEFINED" : searchResult[i].senderstatus;
    const searchResultView = `<div class="md-form mb-3">
                                <div style="font-size: x-small; color:grey; padding-left: 10px"> ${searchResult[i].sendername} [${senderStatus}] ${searchResult[i].ts} </div>
                                <div style="font-size: smaller; padding-left: 10px"><span> ${searchResult[i].content} </span></div>
                              </div>`
    $("#searchResult").append(searchResultView);
  }
  if ((loadMoreClickCount * increaseBy) >= searchResult.length) {
    $("#search-more-btn").hide();
  }
  $('#search-box').modal('handleUpdate');
}

function printAnnouncementSearchResultsHelper(searchResult) {//DONE
  for (var i = 0; i < searchResult.length && i < loadMoreClickCount * increaseBy; i++) {
    const searchResultView = `<div class="md-form mb-3">
                                <div style="font-size: x-small; color:grey; padding-left: 10px"> ${searchResult[i].sendername} ${searchResult[i].ts} </div>
                                <div style="font-size: smaller; padding-left: 10px"><span> ${searchResult[i].content} </span></div>
                              </div>`
    $("#searchResult").append(searchResultView);
  }
  if ((loadMoreClickCount * increaseBy) >= searchResult.length) {
    $("#search-more-btn").hide();
  }
  $('#search-box').modal('handleUpdate');
}

function printESNSearchByNameResultsHelper(searchResult) {
  for (var i = 0; i < searchResult.length; i++) {
    console.log(searchResult[i].isonline);
    const isOnlineColor = (searchResult[i].isonline == 1) ? "green" : "gray";
    const isOnline = (searchResult[i].isonline == 1) ? "Online" : "Offline";
    var status = ["UNDEFINED", "OK", "HELP", "EMERGENCY"];
    var statusColor = ["gray", "green", "#ff8c00", "red"];

    if (searchResult[i].status == undefined)
      searchResult[i].status = 0;

    const searchResultView = `<div class="md-form mb-3">
                                <div style="color:black; padding-left: 10px"> ${searchResult[i].username}  <span style="color:${statusColor[searchResult[i].status]};"> ${status[searchResult[i].status]} </span> </div>
                                <div style="color:${isOnlineColor}; padding-left: 10px"> ${isOnline} </div>
                              </div>`
    $("#searchResult").append(searchResultView);
  }
  $("#search-more-btn").hide();

  $('#search-box').modal('handleUpdate');
}

function printESNSearchByStatusResultsHelper(searchResult) {
  for (var i = 0; i < searchResult.length; i++) {
    const isOnlineColor = (searchResult[i].isonline === "1") ? "green" : "gray";
    const isOnline = (searchResult[i].isonline == 1) ? "Online" : "Offline";
    const searchResultView = `<div class="md-form mb-3">
                                <div style="color:black; padding-left: 10px"> ${searchResult[i].username} </div>
                                <div style="color:${isOnlineColor}; padding-left: 10px"> ${isOnline} </div>
                              </div>`
    $("#searchResult").append(searchResultView);
  }
  $("#search-more-btn").hide();

  $('#search-box').modal('handleUpdate');
}


//END OF SEARCH----------------------------------------------------------------------------------------------

/** Notification */
const checkUnreadmsgForInboxBtn = function (username) {
  console.log("checkUnreadmsgForInboxBtn called");
  $.ajax({
    url: "/api/users/" + username + "/private",
    type: "GET",
    dataType: "json",
    success: function (res) {
      //add each user to html
      var is_any_unread = false;
      $.each(res.data, (index, user) => {
        if (user.count > 0) {
          is_any_unread = true;
        }
      });
      // inbox notification
      const inboxBtn = $("#inbox-btn");
      if (is_any_unread) {
        inboxBtn.attr('style', 'color:red');
      } else {
        inboxBtn.attr("style", "color:white");
      }
    },
  });
}
/** End of Notification */
/** Logout */
function logout(username) {
  $.ajax({
    url: `/api/users/${username}/offline`,
    type: "PUT",
    data: username,
    dataType: "json",

    success: function (
      res // get return message from server
    ) {
      sessionStorage.removeItem("username");
      window.location.href = "/";
    },
  });
}
/** End of Logout */


/** Insert View */
function getNavbar() {
  return `      
        <nav class="navbar navbar-dark">
          <div class="mr-auto d-inline-flex">
              <a class="nav-link nav-txt" href="/cloudwatch" id="dir-btn"><em class="fas fa-eye" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/elb" id="announcement-btn"><em class="fas fa-balance-scale" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/chatroom" id="public-chat-btn"><em class="fa fa-comments" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/privateMsgs" id="inbox-btn"><em class="fas fa-envelope" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/status" id="status-btn"><em class="fa fa-medkit" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="#" id="search-icon"><em class="fa fa-search" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt logout-btn" href="#"><em class="fas fa-sign-out-alt"></em></a>
          </div>
        </nav>`;
}


function getSearchBox(titleHere) {
  return `<div class="modal fade" id="search-box" tabindex="-1" role="dialog">
                <div class="modal-dialog modal-dialog-scrollable modal-dialog-centered" role="document">
                    <div class="modal-content">    
                    ${getSearchBoxHeader()}
                    ${getSearchBoxBody(titleHere)}
                    ${getSearchBoxFooter()}
                    </div>
                </div>
            </div>`;
}


function getSearchBoxHeader() {
  return `<div class="modal-header text-center">
              <h4 class="modal-title w-100 font-weight-bold">Search</h4>
              <button data-dismiss="modal" aria-label="Close" style="border:none; background-color: white;">
                <i class="far fa-times-circle" style="color:grey;"></i>
              </button>
          </div>`;
}

function getSearchBoxBody(titleHere) {

  console.log(`title: ${titleHere}`);
  if (titleHere === "ESN") {
    console.log('title === "ESN"');
    return getESNSearchBoxBody();
  } else {
    console.log('other');
    return getRegularSearchBoxBody();
  }

}

function getESNSearchBoxBody() {

  return `<div class="modal-body mx-6" text-center>
              <div class="md-form mb-3">

                <div class="container-fluid status-radio-btn">
                  <p style="margin-left:10%;">Search User By Status</p>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="searchRadio1" value="OK" checked>
                    <label class="form-check-label" for="inlineRadio1">OK</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="searchRadio2" value="HELP">
                    <label class="form-check-label" for="inlineRadio2">HELP</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input class="form-check-input" type="radio" name="inlineRadioOptions" id="searchRadio3" value="EMERGENCY">
                    <label class="form-check-label" for="inlineRadio3">EMERGENCY</label>
                  </div>
                  <button type="button" id="status-search-btn" class="btn btn-primary">
                    <i class="fas fa-search"></i>
                  </button>
                </div>

                <div class="input-group" style="margin-left:10%; padding-top:10%">
                <p>Search User By Name</p>
                  <div class="form-outline">
                    <input type="search" id="keywords" class="form-control" />
                  </div>
                  <button type="button" id="name-search-btn" class="btn btn-primary">
                    <i class="fas fa-search"></i>
                  </button>
                </div>  
              </div> 
              <div id="searchResult"></div>  
          </div>`;
}

function getRegularSearchBoxBody() {
  return `<div class="modal-body mx-6" text-center>
              <div class="md-form mb-3">
                    <div class="input-group" style="margin-left:10%;">
                      <div class="form-outline">
                        <input type="search" id="keywords" class="form-control" />
                      </div>
                      <button type="button" id="search-btn" class="btn btn-primary">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>  
              </div> 
              <div id="searchResult"></div>  
          </div>`;
}

function getSearchBoxFooter() {
  return `<div class="modal-footer d-flex justify-content-center">
              <button id="search-more-btn" style="border:none; background-color: white;">
                <i class="fas fa-angle-double-down"></i>
              </button>
          </div>`;
}

/** End of Insert View */
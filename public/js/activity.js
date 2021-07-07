const owner = sessionStorage.getItem('username');
$(document).ready(() => {
    console.log("activity.js is accessed");
    sessionStorage.removeItem("talkingToUsername");
    sessionStorage.removeItem("privateMsgUserJson");

    showPage("EntryActivity");
    setupEvent();
    
});

function setupEvent() {
    $('#holdActivityId').click(holdActivity);

    /** hold activity flow **/
    $('#createActivityId').click(createActivity);

    /** hold activity flow - view **/
    $('#viewActivityICreatedId').click(viewActivityICreated);

    /** hold activity flow - create **/
    $('#activityNoOfPeopleNeededIncrementId').click(activityNoOfPeopleNeededIncrement);
    $('#activityNoOfPeopleNeededDecrementId').click(activityNoOfPeopleNeededDecrement);

    $('#activityNoOfHourIncrementId').click(activityNoOfHourIncrement);
    $('#activityNoOfHourDecrementId').click(activityNoOfHourDecrement);

    $('#createActivityBtnId').click(createActivityBtn);

    $('#viewActivityICreatedAfterCreatedId').click(viewActivityICreated);

    /** hold activity flow - update **/
    $('#updateActivityICreatedViewCancelBtnId').click(updateActivityICreatedViewCancel);
    
    $('#activityDropdownMenu .dropdown-item').click(updateActivityDropdownMenu);

    $('#updateActivityICreatedViewBtnId').click(updateActivityICreatedViewBtn);

    $('#viewActivityICreatedAfterUpdatedId').click(viewActivityICreated);
    

    /** participate activity flow **/
    $('#participateActivityId').click(participateActivity);
    $('#joinActivityId').click(joinActivityView);

    $('#RegisterActivityViewIdCancelBtnId').click(joinActivityView);
    $('#RegisterActivityViewIdBtnId').click(registerActivityViewIdBtn);
    $('#viewActivityIJoinedAfterJoinedId').click(showActivityIJoined); 

    $('#viewActivityIJoinedId').click(showActivityIJoined); 

    $('#UnregisterActivityViewCancelBtnId').click(showActivityIJoined); 

    $('#UnregisterActivityViewBtnId').click(unregisterActivityViewBtn); 
    
    $('#UnjoinedActivityConfirmationViewBtnId').click(showActivityIJoined); 
    
}

function unregisterActivityViewBtn() {
    console.log("unregisterActivityViewBtn() called");
    const activityId = $("#activityIdInput-unjoin").val(); 
    unjoinActivityAPI(activityId);    
}

function showActivityIJoined() {
    console.log("showActivityIJoined() called");
    showActivityIJoinedAPI();
}

function showActivityIJoinedAPI() {
    console.log("showActivityIJoinedAPI() called");
    $.ajax({
        url: `/api/activity/joined?username=${owner}`,
        type: "GET",
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("GET /api/activity/joined - res: " , res);
            showPage("ViewActivityIJoinedView"); 
            appendJoinedActivityRows(res.data); 
        },
    });      

}

function registerActivityViewIdBtn() {
    console.log("RegisterActivityViewIdBtn() called");
    const activityId = $("#activityIdInput-join").val(); 
    joinActivityAPI(activityId);
}

function unjoinActivityAPI(activityId) {
    console.log("unjoinActivityAPI() called");
    $.ajax({
        url: `/api/activity/unjoin/${activityId}?username=${owner}`, 
        type: "POST",
        // data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("POST /api/activity/unjoin - res: " , res);
            showPage("UnjoinedActivityConfirmationView");
        },
    });    
}

function joinActivityAPI(activityId) {
    console.log("joinActivityAPI() called");
    $.ajax({
        url: `/api/activity/join/${activityId}?username=${owner}`,
        type: "POST",
        // data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("POST /api/activity/join/id - res: " , res);
            showPage("JoinedActivityConfirmationView");
        },
    });    
}

function joinActivityView() {
    console.log("joinActivityView() called");
    viewActivityICanJoinViewAPI();
    
}

function viewActivityICanJoinViewAPI() {
    $.ajax({
        url: `/api/activity/waiting?usernameToJoin=${owner}`, 
        type: "GET",
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("GET /api/activity/waiting - res: " , res.data);
            showPage("ViewActivityICanJoinView");
            appendActivityRowsForJoin(res.data);
        },
    });    
}

function viewActivityICreatedAfterUpdated() {
    console.log("viewActivityICreatedAfterUpdated() called");
    showPage("viewActivityICreatedAfterUpdated");
}

function updateActivityICreatedViewBtn() {
    console.log("updateActivityICreatedViewBtn() called");
    const activityId = $("#activityIdInput-update").val();
    const activityStatus = $("#activityDropdownMenuButton").html();
    
    const sendData = {
        "status": activityStatus
    };

    $.ajax({
        url: `/api/activity/${activityId}`,
        type: "PUT",
        data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("PUT /api/activity/id - res: " , res.data);
            showPage("updateActivityConfirmationView"); 
        },
    });    
}

function updateActivityDropdownMenu() {
    console.log("updateActivityDropdownMenu() this: " , this);
    console.log("updateActivityDropdownMenu() this.text: " , this.text);

    $("#activityDropdownMenuButton").html(this.text);
}

function updateActivityICreatedViewCancel() {
    console.log("updateActivityICreatedViewCancel() called");
    showPage("viewActivityICreated");
}

function createActivityBtn() {
    console.log("createActivityBtnId() called");
    const isValid = validateCreateActivityInput();
    if (isValid === true) {
        createActivityAPI();
    }
}

function validateCreateActivityInput() {
    console.log("validateCreateActivityInput() called");
    if ($("#activityNameInput").val() === ""
        || $("#activityTimeInput").val() === ""
        || $("#activityAddrInput").val() === "") {
        showPage("CreateActivityValidation");
        return false;
    }

    return true;

    // activityNameInput
    // activityTimeInput
    // activityAddrInput

}

function createActivityAPI() {
    console.log("createActivityAPI() called");

    disableCreateActivityBtn();

    const sendData = {
        organizer: owner,
        activityName: $("#activityNameInput").val(),
        activityTime: $("#activityTimeInput").val(),
        activityAddr: $("#activityAddrInput").val(),
        numOfPeopleNeeded: $("#activityNoOfPeopleNeededValue").val(), 
        numOfHour: $("#activityNoOfHourValue").val()
    };    
    createActivityAPIInvocate(sendData);

}

function disableCreateActivityBtn() {
    $("#createActivityBtnId").prop('disabled', true);
    $("#createActivityBtnId").html('Processing...');
}

function createActivityAPIInvocate(sendData) {
    $.ajax({
        url: "/api/activity",
        type: "POST",
        data: sendData, 
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("POST /api/activity - res: " , res);
            showPage("CreateActivityConfirmationView");
        },
    });
}

function activityNoOfHourDecrement() {
    console.log("activityNoOfHourDecrement() called");
    console.log("activityNoOfHourDecrement() noOfHourNeeded: " , noOfHourNeeded);
    var noOfHourNeeded = parseInt($('#activityNoOfHourValue').val(), 10);
    if (noOfHourNeeded === 0) return;
    $('#activityNoOfHourValue').val(noOfHourNeeded - 1);
}

function activityNoOfHourIncrement() {
    console.log("activityNoOfHourIncrement() called");
    console.log("activityNoOfHourIncrement() noOfHourNeeded: " , noOfHourNeeded);
    var noOfHourNeeded = parseInt($('#activityNoOfHourValue').val(), 10);
    $('#activityNoOfHourValue').val(noOfHourNeeded + 1);
}

function activityNoOfPeopleNeededDecrement() {
    console.log("activityNoOfPeopleNeededDecrement() called");
    console.log("activityNoOfPeopleNeededDecrement() noOfPeopleNeeded: " , noOfPeopleNeeded);
    var noOfPeopleNeeded = parseInt($('#activityNoOfPeopleNeededValue').val(), 10);
    if (noOfPeopleNeeded === 0) return;
    $('#activityNoOfPeopleNeededValue').val(noOfPeopleNeeded - 1);
}

function activityNoOfPeopleNeededIncrement() {
    console.log("activityNoOfPeopleNeededIncrement() called");
    console.log("activityNoOfPeopleNeededIncrement() noOfPeopleNeeded: " , noOfPeopleNeeded);
    var noOfPeopleNeeded = parseInt($('#activityNoOfPeopleNeededValue').val(), 10);
    $('#activityNoOfPeopleNeededValue').val(noOfPeopleNeeded + 1);
}

function holdActivity() {
    console.log("holdActivity() called");
    showPage("HoldActivity");
}

function participateActivity() {
    console.log("participateActivity() called");
    showPage("ParticipateActivityView");
}

function createActivity() {
    console.log("createActivity() called");
    showPage("CreateActivity");
}

function viewActivityICreated() {
    console.log("viewActivityICreated() called");

    viewActivityICreatedAPI();

}

function viewActivityICreatedAPI() {
    $.ajax({
        url: `/api/activity?username=${owner}`,
        type: "GET",
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("GET /api/activity - res: " , res.data);
            showPage("viewActivityICreated");
            appendActivityRows(res.data);
        },
    });
}

function appendJoinedActivityRows(activityList) {
    $("#activityTBody-joined").html("");
    for (var i = 0; i < activityList.length ;i++) {
        const activity = activityList[i];
        console.log("joined activity i: ", i);
        $("#activityTBody-joined").append(getJoinedActivityRowView(activity.activityid, activity.activityTime, activity.activityName, activity.activityAddr, activity.activityStatus));
        console.log("appendJoinedActivityRows() activity.activityid: ", activity.activityid);
        $(`#joined-${activity.activityid}`).click(gotoUpdateActivityForCancel);
    }
}

function appendActivityRowsForJoin(activityList) {
    $("#activityTBody-joinActivity").html("");
    for (var i = 0; i < activityList.length ;i++) {
        const activity = activityList[i];
        $("#activityTBody-joinActivity").append(getActivityRowView(activity.activityid, activity.activityTime, activity.activityName, activity.activityAddr, activity.activityStatus));
        $(`#${activity.activityid}`).click(gotoUpdateActivityForJoin);
    }
}

function gotoUpdateActivityForCancel() {
    console.log("gotoUpdateActivityForCancel() called - this: ", this);
    console.log("gotoUpdateActivityForCancel() called - this.id: ", this.id);
    const activityId = this.id.replace("joined-","");

    getActivityByIdAPIForCancel(activityId);
    
}

function getActivityByIdAPIForCancel(id) {
    console.log("getActivityByIdAPIForCancel() called");
    $.ajax({
        url: `/api/activity/${id}`,
        type: "GET",
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("GET /api/activity/id - res: " , res.data);
            showPage("UnregisterActivityView");
            updateJoinedActivityPage(res.data[0]); 
        },
    });    
}

function gotoUpdateActivityForJoin() {
    console.log("gotoUpdateActivityForJoin() called - this: ", this);
    console.log("gotoUpdateActivityForJoin() called - this.id: ", this.id);
    const activityId = this.id;

    getActivityByIdAPIForJoin(activityId);
    
}

function getActivityByIdAPIForJoin(id) {
    console.log("getActivityByIdAPIForJoin() called");
    $.ajax({
        url: `/api/activity/${id}`,
        type: "GET",
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("GET /api/activity/id - res: " , res.data);
            showPage("RegisterActivityView");
            updateActivityIJoinedPageForJoin(res.data[0]);
        },
    });    
}

function updateJoinedActivityPage(activity) {
    console.log("updateJoinedActivityPage() called");

    $("#activityIdInput-unjoin").val(activity.activityid);
    $("#activityNameInput-unjoin").val(activity.activityName);
    $("#activityTimeInput-unjoin").val(activity.activityTime);
    $("#activityAddrInput-unjoin").val(activity.activityAddr);
    $("#activityDropdownMenuButton-unjoin").html(activity.activityStatus);
    $("#activityNoOfPeopleNeededValue-unjoin").val(activity.numOfPeopleNeeded);
    $("#activityNoOfPeopleRegistered-unjoin").val(activity.numOfPeopleRegistered);
    $("#activityNoOfHourValue-unjoin").val(activity.numOfHour);
    
}

function updateActivityIJoinedPageForJoin(activity) {

    // activity.activityid, activity.activityTime, , activity.activityAddr, activity.activityStatus

    $("#activityIdInput-join").val(activity.activityid);
    $("#activityNameInput-join").val(activity.activityName);
    $("#activityTimeInput-join").val(activity.activityTime);
    $("#activityAddrInput-join").val(activity.activityAddr);
    $("#activityDropdownMenuButton-join").html(activity.activityStatus);
    $("#activityNoOfPeopleNeededValue-join").val(activity.numOfPeopleNeeded);
    $("#activityNoOfPeopleRegistered-join").val(activity.numOfPeopleRegistered);
    $("#activityNoOfHourValue-join").val(activity.numOfHour);
    
    
}



function appendActivityRows(activityList) {
    $("#activityTBody").html("");
    for (var i = 0; i < activityList.length ;i++) {
        const activity = activityList[i];
        $("#activityTBody").append(getActivityRowView(activity.activityid, activity.activityTime, activity.activityName, activity.activityAddr, activity.activityStatus));
        $(`#${activity.activityid}`).click(gotoUpdateActivity);
    }
}


function getActivityRowView(id, time, title, place, status) {
    return  `
            <tr id="${id}">
            <td>${time}</td>
            <td>${title}</td>
            <td>${place}</td>
            <td>${status}</td>
            </tr>
            `
}

function getJoinedActivityRowView(id, time, title, place, status) {
    return  `
            <tr id="joined-${id}">
            <td>${time}</td>
            <td>${title}</td>
            <td>${place}</td>
            <td>${status}</td>
            </tr>
            `
}

function gotoUpdateActivity() {
    console.log("gotoUpdateActivity() called - this: ", this);
    console.log("gotoUpdateActivity() called - this.id: ", this.id);
    const activityId = this.id;

    getActivityByIdAPI(activityId);
    
}

function getActivityByIdAPI(id) {
    console.log("getActivityByIdAPI()");
    $.ajax({
        url: `/api/activity/${id}`,
        type: "GET",
        dataType: "json",
        success: function (
            res // get return message from server
        ) {
            console.log("GET /api/activity/id - res: " , res.data);
            showPage("UpdateActivityICreated");
            updateActivityICreatedPage(res.data[0]);
        },
    });    
}

function updateActivityICreatedPage(activity) {

    // activity.activityid, activity.activityTime, , activity.activityAddr, activity.activityStatus

    $("#activityIdInput-update").val(activity.activityid);
    $("#activityNameInput-update").val(activity.activityName);
    $("#activityTimeInput-update").val(activity.activityTime);
    $("#activityAddrInput-update").val(activity.activityAddr);
    $("#activityDropdownMenuButton").html(activity.activityStatus);
    $("#activityNoOfPeopleNeededValue-update").val(activity.numOfPeopleNeeded);
    $("#activityNoOfPeopleRegistered-update").val(activity.numOfPeopleRegistered);
    $("#activityNoOfHourValue-update").val(activity.numOfHour);
    
    
}

function showPage(pageName) {
    console.log("showPage() called");
    $('#ActivityEntryViewId').hide();
    $('#holdActivityViewId').hide();
    $('#CreateActivityViewId').hide();
    $('#CreateActivityConfirmationViewId').hide();
    $('#ViewActivityICreatedViewId').hide();
    $('#UpdateActivityICreatedViewId').hide();
    $('#updateActivityConfirmationViewId').hide();
    $('#viewActivityICreatedAfterUpdated').hide();
    $('#ParticipateActivityViewId').hide();
    $('#ViewActivityICanJoinViewId').hide();
    $('#RegisterActivityViewId').hide();
    $('#JoinedActivityConfirmationViewId').hide();
    $('#ViewActivityIJoinedViewId').hide();
    $('#UnregisterActivityViewId').hide();
    $('#UnjoinedActivityConfirmationViewId').hide();
    $("#CreateActivityValidationId").hide();

    if (pageName === "HoldActivity") {
        $('#holdActivityViewId').show();
    }else if (pageName === "EntryActivity") {
        $('#ActivityEntryViewId').show();
    }else if (pageName === "CreateActivity") {
        $('#CreateActivityViewId').show();
    }else if (pageName === "CreateActivityConfirmationView") {
        $('#CreateActivityConfirmationViewId').show();
    }else if (pageName === "viewActivityICreated") {
        $('#ViewActivityICreatedViewId').show();
    }else if (pageName === "UpdateActivityICreated") {
        $('#UpdateActivityICreatedViewId').show();
    }else if (pageName === "updateActivityConfirmationView") {
        $('#updateActivityConfirmationViewId').show();
    }else if (pageName === "ParticipateActivityView") {
        $('#ParticipateActivityViewId').show();
    }else if (pageName === "ViewActivityICanJoinView") {
        $('#ViewActivityICanJoinViewId').show();
    }else if (pageName === "RegisterActivityView") {
        $('#RegisterActivityViewId').show();
    }else if (pageName === "JoinedActivityConfirmationView") {
        $('#JoinedActivityConfirmationViewId').show();
    }else if (pageName === "ViewActivityIJoinedView") {
        $('#ViewActivityIJoinedViewId').show();
    }else if (pageName === "UnregisterActivityView") {
        $('#UnregisterActivityViewId').show();
    }else if (pageName === "UnjoinedActivityConfirmationView") {
        $('#UnjoinedActivityConfirmationViewId').show();
    }else if (pageName === "CreateActivityValidation") {
        $('#CreateActivityViewId').show();
        $('#CreateActivityValidationId').show();
    }
}


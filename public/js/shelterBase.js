const providername = sessionStorage.getItem("username");
var hasActiveEntry;
$(document).ready(() => {

    $.ajax({
        url: `/api/shelters`,
        type: "GET",
        data: {
            providername: providername
        },
        success: function (res) {
            console.log(`res length is ${JSON.stringify(res)}`);
            console.log(`res length is ${res.data.length}`);
            if (res.data.length === 1) {
                sessionStorage.setItem("hasActiveShelterEntry", true);
            } else {
                sessionStorage.setItem("hasActiveShelterEntry", false);
            }
            hasActiveEntry = sessionStorage.getItem("hasActiveShelterEntry");
        },
    });
});

$('#go').click((e) => {
    e.preventDefault();
    
    if (hasActiveEntry==="true") {
      $('#errorModal').modal('show');
    } else {
        window.location.href = window.location.origin + "/shelters/search";
    }
  });
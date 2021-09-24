$(document).ready(() => {
  $("#bottom-nav-template").append(getBottomNavbar());
});

function getBottomNavbar() {
    return `      
        <nav class="navbar navbar-dark" style="height: 100%;">
            <div class="mr-auto d-inline-flex">
            </div>
        </nav>
        `;
}

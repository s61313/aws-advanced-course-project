$(document).ready(() => {
  $("#nav-template").append(getNavbar());
});

function getNavbar() {
  return `      
        <nav class="navbar navbar-dark">
          <div class="mr-auto d-inline-flex">
              <a class="nav-link nav-txt" href="/all" id="announcement-btn"><em class="fas fa-balance-scale" aria-hidden="true"></em></a>
          </div>
        </nav>`;
}

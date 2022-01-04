$(document).ready(() => {
  $("#nav-template").append(getNavbar());
});

function getNavbar() {
  return `      
        <nav class="navbar navbar-dark">
          <div class="mr-auto d-inline-flex">
              <a class="nav-link nav-txt" href="/all" id="announcement-btn"><em class="fas fa-home" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/all_agenda" id="announcement-btn"><em class="fas fa-stream" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/all_buy_ticket" id="announcement-btn"><em class="fas fa-ticket-alt" aria-hidden="true"></em></a>
              <a class="nav-link nav-txt" href="/all_admin" id="announcement-btn"><em class="fas fa-dollar-sign" aria-hidden="true"></em></a>
          </div>
        </nav>`;
}

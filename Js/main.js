const landingPageContainer = document.querySelector("#landingPage");
const visitorContainer = document.querySelector("#visitors");
const visitorListingContainer = document.querySelector("#visitorsListing");
const artistsContainer = document.querySelector("#artists");
const artistsItemsContainer = document.querySelector("#artistsItems");
const auctionContainer = document.querySelector("#auction");
const navText = document.querySelector(".logo-text");
const navLogo = document.querySelector(".logo-img");
const navMenuBtn = document.querySelector(".menu-btn");
const auctionBtn = document.querySelector(".auction-btn");
const header = document.querySelector("header");
const logoContainer = document.querySelector(".logo");
const notFoundContainer = document.querySelector("#notFound");

let data;
if (localStorage.getItem("itemsData")) {
  data = JSON.parse(localStorage.getItem("itemsData"));
} else {
  localStorage.setItem("itemsData", JSON.stringify(items));
  data = JSON.parse(localStorage.getItem("itemsData"));
}

cbiIndex = data.findIndex((item) => item.isAuctioning);
currentBiddingItem = data[cbiIndex];

let artistDropdown = document.querySelector("#artistDropdown");
currentBiddingItem = {};

let artistName;
let userIsVisitor;
navMenuBtn.addEventListener("click", () => {
  document.querySelector(".navigation").classList.toggle("active");
});

function handleRoute(e) {
  let data;
  if (localStorage.getItem("itemsData")) {
    data = JSON.parse(localStorage.getItem("itemsData"));
  } else {
    localStorage.setItem("itemsData", JSON.stringify(items));
    data = JSON.parse(localStorage.getItem("itemsData"));
  }
  document.querySelector(".navigation").classList.remove("active");
  if (localStorage.getItem("currentArtist")) {
    artistName = localStorage.getItem("currentArtist");
  }
  e.preventDefault();
  const hash = location.hash;

  switch (hash) {
    case "":
      location.hash = "#landingPage";
      break;
    case "#landingPage":
      let logoText = document.querySelector(".logo-text");
      logoText.innerText = `Street ARTists`;
      let joinAsArtistBtn = document.querySelector(".up");
      let joinAsVisitorBtn = document.querySelector(".down");
      let artistDropdown = document.querySelector("#artistDropdown");
      joinAsArtistBtn.addEventListener("click", (e) => {
        localStorage.setItem("currentArtist", `${artistDropdown.value}`);
        artistName = localStorage.getItem("currentArtist");
        joinAsArtist(artistName, artistDropdown);
      });
      joinAsVisitorBtn.addEventListener("click", joinAsVisitor);

      artistDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });
      onLandingPage();
      userIsVisitor = null;
      break;
    case "#artists":
      onArtistsPage(artistName);
      showStatistics(artistName);
      createChart();
      userIsVisitor = false;
      localStorage.setItem("userType", "artist");
      break;

    case "#artists/items":
      onArtistsItemsPage();
      artistItemsPage();

      userIsVisitor = false;
      localStorage.setItem("userType", "artist");
      break;

    case "#visitors":
      onVisitorsPage();
      carousel();

      userIsVisitor = true;
      localStorage.setItem("userType", "visitor");
      break;
    case "#visitors/listing":
      onVisitorsListingPage();
      visitorListingPage();
      localStorage.setItem("userType", "visitor");
      userIsVisitor = true;
      //////
      break;
    case "#auction":
      onAuctionPage();
      break;
    default:
      onNotFoundPage();
  }
}

window.addEventListener("hashchange", handleRoute);
window.addEventListener("load", handleRoute);

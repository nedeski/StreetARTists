function onNotFoundPage() {
  landingPageContainer.style.display = "none";
  visitorContainer.style.display = "none";
  visitorListingContainer.style.display = "none";
  artistsContainer.style.display = "none";
  artistsItemsContainer.style.display = "none";
  auctionContainer.style.display = "none";
  notFoundContainer.style.display = "block";
}
function onLandingPage() {
  landingPageContainer.style.display = "block";
  visitorContainer.style.display = "none";
  visitorListingContainer.style.display = "none";
  artistsContainer.style.display = "none";
  artistsItemsContainer.style.display = "none";
  auctionContainer.style.display = "none";
  notFoundContainer.style.display = "none";
  fetchUsers();
}

function fetchUsers() {
  fetch("https://jsonplaceholder.typicode.com/users")
    .then((res) => res.json())
    .then((data) => {
      document.querySelector(".artist-dropdown").innerHTML = "";
      let username = document.createElement("option");
      username.setAttribute("value", ``);
      username.innerText = `choose an artist`;
      document.querySelector(".artist-dropdown").appendChild(username);
      data.forEach((user) => {
        let username = document.createElement("option");
        username.innerText = `${user.name}`;
        username.setAttribute("value", `${user.name}`);
        document.querySelector(".artist-dropdown").appendChild(username);
      });
    });
}

function joinAsArtist(currentArtist, list) {
  currentArtist = list.value;
  userIsVisitor = false;
  if (list.value !== "") {
    location.hash = "#artists";

    let logoText = document.querySelector(".logo-text");
    logoText.innerText = `${currentArtist}`;
  }
}
function joinAsVisitor() {
  location.hash = "#visitors";
  userIsVisitor = true;
}

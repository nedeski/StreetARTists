function onArtistsPage() {
  document.querySelector(".logo-text").innerText = `${artistName}`;
  landingPageContainer.style.display = "none";
  visitorContainer.style.display = "none";
  visitorListingContainer.style.display = "none";
  artistsContainer.style.display = "block";
  artistsItemsContainer.style.display = "none";
  auctionContainer.style.display = "none";
  notFoundContainer.style.display = "none";

  let isAnyAuction = data.filter((item) => item.isAuctioning === true);
  if (isAnyAuction.length >= 1) {
    document.querySelector(".live-auctioning").style.display = "block";
  } else {
    document.querySelector(".live-auctioning").style.display = "none";
  }

  // Menu
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.classList.add("d-flex");
  navMenuBtn.style.display = "block";
  navLogo.style.display = "block";
  logoContainer.classList.add("d-flex");
}

function showStatistics(selectedArtist) {
  selectedArtistItems = artistItemArray(selectedArtist);
  selectedArtistItems.forEach((item) => {
    console.log(new Date(item.dateCreated));
    console.log(Date.parse(item.dateCreated));
    console.log(Date.parse(item.dateCreated) - 86400000);
    console.log(new Date(Date.parse(item.dateCreated) - 86400000));
  });

  artistIncome(selectedArtistItems);
  artistSoldItems(selectedArtistItems);
  showCurrentBid(selectedArtistItems);
}

function artistIncome(artistItemsArray) {
  let totalIncome = 0;
  artistItemsArray.forEach((item) => {
    totalIncome = totalIncome + item.priceSold;
  });
  document.querySelector(".income-amount").innerText = `$${totalIncome}`;
}
function artistSoldItems(artistItemsArray) {
  let soldItems = artistItemsArray.filter((item) =>
    item.hasOwnProperty("dateSold")
  );

  document.querySelector(
    ".item-qty"
  ).innerText = `${soldItems.length}/${artistItemsArray.length}`;
}
function showCurrentBid(artistItemsArray) {
  let currentBid = document.querySelector(".live-auctioning .auction-amount");
  let itemsOnAuction = artistItemsArray.filter((item) => item.isAuctioning);
  if (itemsOnAuction.length >= 1) {
    if (localStorage.getItem("allBidsData")) {
      currentBid.innerText = `${
        JSON.parse(localStorage.getItem("allBidsData"))[
          JSON.parse(localStorage.getItem("allBidsData")).length - 1
        ]
      }$`;
    } else {
      currentBid.innerText = `0$`;
    }
  }
}

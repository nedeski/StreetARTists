function onAuctionPage() {
  document.querySelector(".logo-text").innerText = "Street ARTists";
  landingPageContainer.style.display = "none";
  visitorContainer.style.display = "none";
  visitorListingContainer.style.display = "none";
  artistsContainer.style.display = "none";
  artistsItemsContainer.style.display = "none";
  auctionContainer.style.display = "block";
  notFoundContainer.style.display = "none";
  // Menu
  auctionBtn.style.display = "block";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.classList.add("d-flex");
  navMenuBtn.style.display = "none";
  navLogo.style.display = "block";
  logoContainer.classList.add("d-flex");
  auctionPage();
}

function auctionPage() {
  timer = document.querySelector(".timer");
  let time;
  if (localStorage.getItem("auctionTimer") !== null) {
    time = +localStorage.getItem("auctionTimer");
  } else {
    time = 120;
    localStorage.setItem("auctionTimer", time);
    time = +localStorage.getItem("auctionTimer");
  }

  auctionInfo = document.querySelector(".auction-info");
  auctionCardContainer = document.querySelector("#auction .card-container");
  auctionActions = document.querySelector(".auction-action");

  bidAmountInput = document.querySelector("#bidAmount");
  confirmBidBtn = document.querySelector("#confirmBid");
  allBidsUl = document.querySelector(".all-bids-list");
  bidForm = document.querySelector("#bidForm");
  auctionCardContainer.innerHTML = "";
  auctionDone = document.querySelector(".auction-action h2");
  itemsOnAuction = data.filter((item) => item.isAuctioning);
  if (localStorage.getItem("userType") == "artist") {
    bidForm.style.display = "none";
  } else if (localStorage.getItem("noBid") !== null) {
    confirmBidBtn.disabled = true;
    bidAmountInput.value = "";
  } else {
    bidForm.style.display = "block";
  }

  if (itemsOnAuction.length >= 1) {
    document.querySelector(".live-auctioning").style.display = "block";

    auctionInfo.classList.add("d-none");
    auctionActions.classList.remove("d-none");
    auctionCardContainer.classList.remove("d-none");
    currentBiddingItem = itemsOnAuction[0];
    let initialBidPrice = Math.floor(itemsOnAuction[0].price / 2);
    bidAmountInput.min = initialBidPrice;
    itemsOnAuction.forEach((item) => {
      createCard(item);
      initAuctionPage();
    });
  } else {
    document.querySelector(".live-auctioning").style.display = "none";

    auctionInfo.classList.remove("d-none");
    auctionCardContainer.classList.add("d-none");
    auctionActions.classList.add("d-none");
  }

  function initAuctionPage() {
    currentBiddingItemIDX = data.findIndex(
      (item) => item.id === currentBiddingItem.id
    );
    let allBidsData;
    if (localStorage.getItem("allBidsData")) {
      allBidsData = JSON.parse(localStorage.getItem("allBidsData"));
      allBidsData.forEach((bid, idx) => {
        const li = document.createElement("li");
        const p = document.createElement("p");
        p.innerText = `I bid ${bid}`;
        if (idx % 2 == 1) {
          li.classList.add("them");
        } else {
          li.classList.add("me");
        }
        li.appendChild(p);
        allBidsUl.append(li);

        bidAmountInput.setAttribute("min", +bid + 10);
        bidAmountInput.value = +bid + 10;
      });
    } else {
      allBidsData = [];
    }
    let timerInterval;
    function formatTime(seconds) {
      minutes = Math.floor(seconds / 60);
      remainingSeconds = seconds - minutes * 60;
      sDisplay =
        remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;
      mDisplay = minutes < 10 ? `0${minutes}` : minutes;
      return `${mDisplay}: ${sDisplay}`;
    }

    function initTimer(time) {
      if (timerInterval) {
        clearInterval(timerInterval);
      }

      timer.innerText = `${formatTime(time)}`;

      timerInterval = setInterval(() => {
        if (time <= 0) {
          clearInterval(timerInterval);
          data[currentBiddingItemIDX].dateSold = new Date();
          data[currentBiddingItemIDX].priceSold =
            +allBidsData[allBidsData.length - 1];
          data[currentBiddingItemIDX].isAuctioning = false;
          bidForm.style.display = "none";
          auctionDone.style.display = "block";
          window.localStorage.removeItem("auctionTimer");
          window.localStorage.removeItem("allBidsData");
          window.localStorage.removeItem("noBid");
          saveData();

          return;
        }

        time--;
        localStorage.setItem("auctionTimer", time);

        timer.innerText = `${formatTime(time)}`;
      }, 1000);
    }
    function onBidHandler(e) {
      e.preventDefault();
      // apending my bids after click
      const li = document.createElement("li");
      li.classList.add("me");
      let p = document.createElement("p");
      p.innerText = `I bid ${bidAmountInput.value}`;
      li.appendChild(p);

      allBidsUl.appendChild(li);
      allBidsData.push(bidAmountInput.value);
      localStorage.setItem("allBidsData", JSON.stringify(allBidsData));

      // making bid request
      makeBid(bidAmountInput.value).then((data) => {
        let bidAmount = data.bidAmount;
        let isBidding = data.isBidding;

        if (isBidding) {
          initTimer(time);
          // appending their bid to the ul list
          const li = document.createElement("li");
          const p = document.createElement("p");
          p.innerText = `I bid ${bidAmount}`;
          li.classList.add("them");
          li.appendChild(p);
          allBidsUl.append(li);

          allBidsData.push(bidAmount);
          localStorage.setItem("allBidsData", JSON.stringify(allBidsData));

          bidAmountInput.setAttribute("min", bidAmount + 10);
          bidAmountInput.value = bidAmount + 10;
        } else {
          confirmBidBtn.setAttribute("disabled", "");
          const li = document.createElement("li");
          const p = document.createElement("p");
          p.innerText = `Ah... You won... I'm done`;
          li.classList.add("them");
          li.appendChild(p);
          allBidsUl.append(li);
          localStorage.setItem("noBid", "true");
        }
      });
    }
    initTimer(time);

    bidForm.removeEventListener("submit", onBidHandler);
    bidForm.addEventListener("submit", onBidHandler);
  }
  function makeBid(amount) {
    const url = "https://projects.brainster.tech/bidding/api";
    const formData = new FormData();
    formData.set("amount", amount);
    return fetch(url, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => data);
  }

  function createCard(item) {
    let card = document.createElement("div");

    card.classList.add("card", "dark");
    let cardImg = document.createElement("div");
    cardImg.innerHTML = `<img
        src=${item.image}
        alt="">`;
    cardImg.classList.add("card-img");
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    cardHeader.innerHTML = `
        <div class="left">
        <h3 class="artist-name">${item.artist}</h3>
        
      </div>
      <div class="right">
        <span class="price">${Math.floor(item.price / 2)}$</span>
      </div>
        `;
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.innerHTML = `<p>${item.title}</p>
        <p>${item.description}</p>`;

    card.append(cardImg, cardHeader, cardBody);
    auctionCardContainer.appendChild(card);
  }
}

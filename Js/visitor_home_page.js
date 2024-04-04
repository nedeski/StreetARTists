function getData() {
  return JSON.parse(localStorage.getItem("itemsData")) || data;
}

function saveData() {
  localStorage.setItem("itemsData", JSON.stringify(data));
}

function onVisitorsPage() {
  document.querySelector(".logo-text").innerText = "Street ARTists";
  landingPageContainer.style.display = "none";
  visitorContainer.style.display = "block";
  visitorListingContainer.style.display = "none";
  artistsContainer.style.display = "none";
  artistsItemsContainer.style.display = "none";
  auctionContainer.style.display = "none";
  notFoundContainer.style.display = "none";
  // Menu
  auctionBtn.style.display = "block";
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.classList.add("d-flex");
  navMenuBtn.style.display = "none";
  navLogo.style.display = "block";
  logoContainer.classList.add("d-flex");
}

function carousel() {
  let nextBtn = document.querySelector(".carousel .next");
  let prevBtn = document.querySelector(".carousel .prev");
  let carouselWrapper = document.querySelector(".carousel-container .wrapper");
  let counter = 0;

  nextBtn.removeEventListener("click", nextCarousel);
  nextBtn.addEventListener("click", nextCarousel);

  prevBtn.removeEventListener("click", prevCarousel);
  prevBtn.addEventListener("click", prevCarousel);

  function prevCarousel() {
    if (counter < 1) {
      counter = 3;
    }
    counter--;
    carouselWrapper.style.transform = `translate(-${counter * 250}px)`;
  }
  function nextCarousel() {
    if (counter >= 2) {
      counter = -1;
    }
    counter++;
    carouselWrapper.style.transform = `translate(-${counter * 250}px)`;
  }
}

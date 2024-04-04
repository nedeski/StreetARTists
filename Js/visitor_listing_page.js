function onVisitorsListingPage() {
  document.querySelector(".logo-text").innerText = "Street ARTists";
  landingPageContainer.style.display = "none";
  visitorContainer.style.display = "none";
  visitorListingContainer.style.display = "block";
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
  userIsVisitor = true;
}

function visitorListingPage() {
  const publishedItems = data.filter((item) => item.isPublished == true);

  let visitorCardContainer = document.querySelector(
    "#visitorsListing .card-container"
  );
  const filterBtn = document.querySelector(".filterBtn");
  const closeBtn = document.querySelector(".filterPage .closeBtn");
  const applyBtn = document.querySelector(".applyBtn");

  applyBtn.removeEventListener("click", applyFilter);
  applyBtn.addEventListener("click", applyFilter);

  filterBtn.removeEventListener("click", openFilterModal);
  filterBtn.addEventListener("click", openFilterModal);

  closeBtn.removeEventListener("click", closeFilterModal);
  closeBtn.addEventListener("click", closeFilterModal);

  fetchUsersAndTypesforFilters();

  createVisitorCards(publishedItems);
  function createVisitorCards(array) {
    visitorCardContainer.innerHTML = "";
    array.forEach((item, idx) => {
      let card = document.createElement("div");

      card.classList.add("card");
      if (idx % 2 == 0) {
        card.classList.add("light");
      } else {
        card.classList.add("dark");
      }
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
		<span class="price">${item.price}$</span>
	  </div>
		`;
      let cardBody = document.createElement("div");
      cardBody.classList.add("card-body");
      cardBody.innerHTML = `<p>${item.title}</p>
		<p>${item.description}</p>`;

      card.append(cardImg, cardHeader, cardBody);
      visitorCardContainer.appendChild(card);
    });
  }
  function openFilterModal() {
    const filterPage = document.querySelector(".filterPage");
    filterPage.classList.remove("d-none");
    visitorCardContainer.classList.add("d-none");
  }
  function closeFilterModal() {
    const filterPage = document.querySelector(".filterPage");
    filterPage.classList.add("d-none");
    visitorCardContainer.classList.remove("d-none");
  }

  function filteredData() {
    const filterbyTitle = document.querySelector("#filterbyTitle").value;
    const filterbyArtist = document.querySelector("#filterbyArtist").value;
    const filterbyMinPrice = document.querySelector("#filterbyMinPrice").value;
    const filterbyMaxPrice = document.querySelector("#filterbyMaxPrice").value;
    const filterbyType = document.querySelector("#filterbyType").value;
    let filteredItems = publishedItems.filter((item) => {
      return (
        (filterbyTitle ? item.title.includes(filterbyTitle) : true) &&
        (filterbyArtist ? item.artist === filterbyArtist : true) &&
        (filterbyMinPrice ? item.price >= filterbyMinPrice : true) &&
        (filterbyMaxPrice ? item.price <= filterbyMaxPrice : true) &&
        (filterbyType ? item.type === filterbyType : true)
      );
    });
    return filteredItems;
  }
  function applyFilter() {
    filteredItems = filteredData();
    createVisitorCards(filteredItems);
    closeFilterModal();
  }

  function fetchUsersAndTypesforFilters() {
    document.querySelector("#filterbyArtist").innerHTML = "";
    document.querySelector("#filterbyType").innerHTML = "";
    let itemType = document.createElement("option");
    itemType.setAttribute("value", ``);
    itemType.innerText = `Any type`;
    document.querySelector("#filterbyType").appendChild(itemType);
    itemTypes.forEach((type) => {
      let typeoption = document.createElement("option");
      typeoption.innerText = `${type}`;
      typeoption.setAttribute("value", `${type}`);
      document.querySelector("#filterbyType").appendChild(typeoption);
    });
    let username = document.createElement("option");
    username.setAttribute("value", ``);
    username.innerText = `All Artists`;
    document.querySelector("#filterbyArtist").appendChild(username);

    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((user) => {
          let username = document.createElement("option");
          username.innerText = `${user.name}`;
          username.setAttribute("value", `${user.name}`);
          document.querySelector("#filterbyArtist").appendChild(username);
        });
      });
  }
}

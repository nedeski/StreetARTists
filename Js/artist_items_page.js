function onArtistsItemsPage() {
  document.querySelector(".logo-text").innerText = `${artistName}`;
  landingPageContainer.style.display = "none";
  visitorContainer.style.display = "none";
  visitorListingContainer.style.display = "none";
  artistsContainer.style.display = "none";
  artistsItemsContainer.style.display = "block";
  auctionContainer.style.display = "none";
  notFoundContainer.style.display = "none";

  // Menu
  header.style.display = "flex";
  header.style.justifyContent = "space-between";
  header.classList.add("d-flex");
  navMenuBtn.style.display = "block";
  navLogo.style.display = "block";
  logoContainer.classList.add("d-flex");
}

function artistItemsPage() {
  let addItemForm = document.querySelector("#addItemForm");
  let openModalBtn = document.querySelector("#openModalBtn");
  let cancelBtn = document.querySelector("#cancelBtn");
  let cardContainer = document.querySelector("#artistsItems .card-container");
  let artistsItemsData = data.filter((item) => item.artist == artistName);
  let idx;
  let editMode = false;
  let isPublishedItem = document.querySelector("#isPublished");
  let itemTitle = document.querySelector("#itemTitle");
  let itemDescription = document.querySelector("#itemDescription");
  let itemType = document.querySelector("#itemType");

  itemTypes.forEach((type, idx) => {
    let option = document.createElement("option");
    if (idx === 0) {
      option.selected = true;
    }
    option.value = type;
    option.innerText = type;
    itemType.appendChild(option);
  });
  let itemPrice = document.querySelector("#itemPrice");
  let itemImage = document.querySelector("#itemImgUrl");

  const video = document.querySelector("#captureImagePage video");
  const canvas = document.querySelector("#camcanvas");
  const img = document.querySelector(".capturedImage");
  renderCards(artistsItemsData, cardContainer);
  cancelBtn.removeEventListener("click", openModal);
  cancelBtn.addEventListener("click", openModal);
  openModalBtn.removeEventListener("click", openModal);
  openModalBtn.addEventListener("click", openModal);
  addItemForm.removeEventListener("submit", addNewCard);
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewCard(e);
  });
  function addNewCard(e) {
    e.preventDefault;
    if (editMode) {
      data[idx].title = itemTitle.value;
      data[idx].description = itemDescription.value;
      data[idx].type = itemType.value;
      data[idx].image = itemImage.value;
      data[idx].price = itemPrice.value;
      data[idx].artist = artistName;
      data[idx].isPublished = isPublishedItem.checked;
      saveData();
      artistsItemsData = data.filter((item) => item.artist == artistName);
      renderCards(artistsItemsData, cardContainer);
      openModal(e);
      editMode = false;
    } else {
      let artistItem = {
        id: new Date().valueOf(),
        title: itemTitle.value,
        description: itemDescription.value,
        type: itemType.value,
        image: itemImage.value,
        price: itemPrice.value,
        artist: artistName,
        dateCreated: new Date().toString(),
        isPublished: isPublishedItem.checked ? true : false,
        isAuctioning: false,
        priceSold: 0,
      };
      data.push(artistItem);
      saveData();
      artistsItemsData = data.filter((item) => item.artist == artistName);
      renderCards(artistsItemsData, cardContainer);
      openModal(e);
    }
    stopStreamedVideo();
  }

  function createCard(array, item) {
    let card = document.createElement("div");
    card.classList.add("card");
    let cardImg = document.createElement("div");
    cardImg.innerHTML = `<img
    src=${item.image}
    alt="">`;
    cardImg.classList.add("card-img");
    let cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");
    cardHeader.innerHTML = `
    <div class="left">
                <h3 class="title">${item.title}</h3>
                <span class="date">${getItemDate(item.dateCreated)}</span>
              </div>
              <div class="right">
                <span class="price">${item.price}$</span>
              </div>
    `;
    let cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    cardBody.innerHTML = `<p>${item.description}</p>`;
    let cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");

    let sendAuctionBtn = document.createElement("button");
    sendAuctionBtn.classList.add("sendToAuctionBtn");
    sendAuctionBtn.id = item.id;
    sendAuctionBtn.innerText = "Send to auction";
    if (
      item.priceSold ||
      data.filter((item) => item.isAuctioning == true).length >= 1
    ) {
      sendAuctionBtn.setAttribute("disabled", "");
    }
    let publishBtn = document.createElement("button");
    publishBtn.classList.add("publishBtn");
    publishBtn.id = item.id;
    if (item.isPublished) {
      publishBtn.innerText = "Unpublish";
    } else {
      publishBtn.innerText = "Publish";
    }

    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("removeBtn");
    deleteBtn.id = item.id;
    deleteBtn.innerText = "Remove";

    let editBtn = document.createElement("button");
    editBtn.classList.add("editBtn");
    editBtn.id = item.id;
    editBtn.innerText = "Edit";
    cardFooter.append(sendAuctionBtn, publishBtn, deleteBtn, editBtn);
    card.append(cardImg, cardHeader, cardBody, cardFooter);
    cardContainer.appendChild(card);

    sendAuctionBtn.removeEventListener("click", sendToAuction);
    sendAuctionBtn.addEventListener("click", sendToAuction);

    deleteBtn.removeEventListener("click", deleteCard);
    deleteBtn.addEventListener("click", deleteCard);

    publishBtn.removeEventListener("click", publishItem);
    publishBtn.addEventListener("click", publishItem);

    editBtn.addEventListener("click", onEditBtnClick);
    editBtn.addEventListener("click", onEditBtnClick);

    function publishItem(e) {
      e.preventDefault();
      idx = data.findIndex((item) => item.id == publishBtn.id);
      data[idx].isPublished = !data[idx].isPublished;
      saveData();
      renderCards(artistsItemsData, cardContainer);
    }
    function sendToAuction(e) {
      e.preventDefault();
      document.querySelector(".live-auctioning").style.display = "block";
      idx = data.findIndex((item) => item.id == sendAuctionBtn.id);
      data[idx].isAuctioning = true;
      saveData();
      renderCards(artistsItemsData, cardContainer);
    }
    function onEditBtnClick(e) {
      e.preventDefault();
      idx = data.findIndex((item) => item.id == editBtn.id);
      openModal(e);
      editMode = true;
      isPublishedItem.checked = data[idx].isPublished;
      itemTitle.value = data[idx].title;
      itemDescription.value = data[idx].description;
      itemType.value = data[idx].type;
      itemPrice.value = data[idx].price;
      itemImage.value = data[idx].image;
    }

    function deleteCard(e) {
      e.preventDefault();
      idx = data.findIndex((item) => item.id == deleteBtn.id);
      data.splice(idx, 1);
      artistsItemsData = data.filter((item) => item.artist == artistName);
      saveData();
      renderCards(artistsItemsData, cardContainer);
    }
  }

  function renderCards(array, container) {
    container.innerHTML = "";
    array.forEach((item) => {
      createCard(array, item);
    });
  }
  function getItemDate(date) {
    let selectedDate = new Date(date);
    return `${selectedDate.getDate()}.${
      selectedDate.getMonth() + 1
    }.${selectedDate.getFullYear()}`;
  }
  function openModal(e) {
    e.preventDefault();
    isPublishedItem.checked = true;
    itemTitle.value = "";
    itemDescription.value = "";
    itemType.value = "";
    itemPrice.value = "";
    itemImage.value = "";
    let addItemModal = document.querySelector(".add-new-item-modal");
    addItemModal.classList.toggle("d-none");
    cardContainer.classList.toggle("d-none");
    let snapshot = document.querySelector(".snapshot");
    snapshot.removeEventListener("click", startCamera);
    snapshot.addEventListener("click", startCamera);
    const img = document.querySelector(".capturedImage");
    img.src = "";
    let takesnapshot = document.querySelector(".takesnapshot");
    takesnapshot.classList.remove("d-none");
    document.querySelector("#itemImgUrl").value = "";
  }
  function startCamera() {
    let addItemModal = document.querySelector(".add-new-item-modal");
    addItemModal.classList.add("d-none");

    let captureImagePage = document.querySelector("#captureImagePage");
    captureImagePage.classList.remove("d-none");
    initCaptureImagePage();
  }
  function initCaptureImagePage() {
    const ssBtn = document.querySelector("#captureImagePage #screenShot");
    const selectVideos = document.querySelector("#captureImagePage #videos");

    ssBtn.removeEventListener("click", takePhoto);
    ssBtn.addEventListener("click", takePhoto);

    function takePhoto() {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext("2d").drawImage(video, 0, 0);
      const imageURL = canvas.toDataURL("image/webp");
      img.src = imageURL;
      document.querySelector("#itemImgUrl").value = imageURL;
      let addItemModal = document.querySelector(".add-new-item-modal");
      addItemModal.classList.remove("d-none");
      let captureImagePage = document.querySelector("#captureImagePage");
      captureImagePage.classList.add("d-none");
      let takesnapshot = document.querySelector(".takesnapshot");
      takesnapshot.classList.add("d-none");
      let capturedImage = document.querySelector(".capturedImage");
      capturedImage.removeEventListener("click", takePhoto);
      capturedImage.addEventListener("click", takePhoto);
    }

    function getStream() {
      const source = selectVideos.value;

      const constrains = {
        video: {
          deviceId: source ? { exact: source } : undefined,
        },
      };

      return navigator.mediaDevices.getUserMedia(constrains).then(gotStream);
    }

    function gotStream(stream) {
      video.srcObject = stream;
    }

    function getDevices() {
      return navigator.mediaDevices.enumerateDevices();
    }

    function gotDevices(deviceInfo) {
      const videoDevices = deviceInfo.filter((x) => x.kind === "videoinput");

      for (let i = 0; i < videoDevices.length; i++) {
        const device = videoDevices[i];

        const opt = document.createElement("option");
        opt.value = device.deviceId;
        opt.text = `Camera ${i + 1} ${device.label || device.deviceId}`;
        selectVideos.appendChild(opt);
      }
    }

    function stopStreamedVideo(e) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();

      tracks.forEach(function (track) {
        track.stop();
      });

      video.srcObject = null;
    }

    getStream().then(getDevices).then(gotDevices);
  }

  function stopStreamedVideo(e) {
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    video.srcObject = null;
  }
}

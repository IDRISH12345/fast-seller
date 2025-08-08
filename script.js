// Open/Close Buy Card
function openCard() {
  document.getElementById("buyCard").style.display = "block";
}
function closeCard() {
  document.getElementById("buyCard").style.display = "none";
}

// Home Button → Reload
document.getElementById("home-btn").addEventListener("click", function () {
  window.location.href = "index.html";
});

// PROPERTY IMAGES FOR GALLERY
let propertyImages = {
  1: ["plot1.jpeg", "plot2.jpeg", "plot3.jpeg", "plot4.jpeg"],
};

let currentGalleryImages = [];
let currentIndex = 0;

// Open grid gallery
function openGridGallery(propertyId) {
  document.getElementById("buyCard").style.display = "none";

  currentGalleryImages = propertyImages[propertyId];
  let gridContainer = document.getElementById("gridContainer");
  gridContainer.innerHTML = "";
  currentGalleryImages.forEach((src, index) => {
    let img = document.createElement("img");
    img.src = src;
    img.alt = `Property Image ${index + 1}`;
    img.classList.add("gallery-thumb");
    img.onclick = () => openFullImage(index);
    gridContainer.appendChild(img);
  });
  document.getElementById("gridGallery").style.display = "flex";
}

// Close grid gallery
function closeGridGallery() {
  document.getElementById("gridGallery").style.display = "none";
  document.getElementById("buyCard").style.display = "block";
}

// Open fullscreen image
function openFullImage(index) {
  currentIndex = index;
  document.getElementById("fullImage").src = currentGalleryImages[currentIndex];
  document.getElementById("fullImageView").style.display = "flex";
}

// Close fullscreen
function closeFullImage() {
  document.getElementById("fullImageView").style.display = "none";
}

// Navigate images
function prevImage() {
  currentIndex = (currentIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
  document.getElementById("fullImage").src = currentGalleryImages[currentIndex];
}
function nextImage() {
  currentIndex = (currentIndex + 1) % currentGalleryImages.length;
  document.getElementById("fullImage").src = currentGalleryImages[currentIndex];
}

// VIDEO POPUP SETUP
const videos = [
  { id: 1, src: "video1.mp4", thumb: "video1-thumb.jpg" },
  { id: 2, src: "video2.mp4", thumb: "video2-thumb.jpg" },
  { id: 3, src: "video3.mp4", thumb: "video3-thumb.jpg" },
];

let currentVideoIndex = 0;

const videoListPopup = document.getElementById("videoListPopup");
const videoList = document.getElementById("videoList");
const videoPlayer = document.getElementById("videoPlayer");

document.getElementById("videoBtn").addEventListener("click", openVideoList);
function openVideoList() {
  videoListPopup.style.display = "flex";
  renderVideoList();
  playVideo(currentVideoIndex);
}

function closeVideoList() {
  videoListPopup.style.display = "none";
  videoPlayer.pause();
}

function renderVideoList() {
  videoList.innerHTML = "";
  videos.forEach((video, i) => {
    const div = document.createElement("div");
    div.classList.add("video-thumbnail");
    if (i === currentVideoIndex) div.classList.add("selected");
    const img = document.createElement("img");
    img.src = video.thumb;
    img.alt = `Video ${video.id}`;
    div.appendChild(img);
    div.onclick = () => {
      currentVideoIndex = i;
      playVideo(i);
      renderVideoList();
    };
    videoList.appendChild(div);
  });
}

function playVideo(index) {
  videoPlayer.src = videos[index].src;
  videoPlayer.play();
}

function prevVideo() {
  currentVideoIndex = (currentVideoIndex - 1 + videos.length) % videos.length;
  playVideo(currentVideoIndex);
  renderVideoList();
}

function nextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videos.length;
  playVideo(currentVideoIndex);
  renderVideoList();
}

// UPLOAD FORM POPUP LOGIC
const uploadPopup = document.getElementById("uploadPopup");
const plusBtn = document.getElementById("plusBtn");
const uploadForm = document.getElementById("uploadForm");
const propertyImagesInput = document.getElementById("propertyImages");
const multiImagePreview = document.getElementById("multiImagePreview");
const propertyList = document.getElementById("propertyList");

plusBtn.addEventListener("click", () => {
  uploadPopup.style.display = "flex";
});

// Close upload popup
function closeUploadPopup() {
  uploadPopup.style.display = "none";
  uploadForm.reset();
  multiImagePreview.innerHTML = "";
  uploadedFiles = [];
}

let uploadedFiles = [];

// Handle image file selection and preview
propertyImagesInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  // Add new files to uploadedFiles array, avoiding duplicates by name+size
  files.forEach((file) => {
    const exists = uploadedFiles.some(
      (f) => f.name === file.name && f.size === file.size
    );
    if (!exists) uploadedFiles.push(file);
  });

  showPreviews();
  // Clear input so same files can be selected again if needed
  propertyImagesInput.value = "";
});

function showPreviews() {
  multiImagePreview.innerHTML = "";

  uploadedFiles.forEach((file, index) => {
    const url = URL.createObjectURL(file);
    const div = document.createElement("div");

    const img = document.createElement("img");
    img.src = url;
    img.alt = file.name;

    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.title = "Remove Image";
    btn.onclick = () => {
      uploadedFiles.splice(index, 1);
      showPreviews();
    };

    div.appendChild(img);
    div.appendChild(btn);
    multiImagePreview.appendChild(div);
  });
}

// Add more images button triggers file input
document.getElementById("addMoreImagesBtn").addEventListener("click", () => {
  propertyImagesInput.click();
});

// Handle form submission and add new property
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (uploadedFiles.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  const name = document.getElementById("propertyName").value.trim();
  const price = document.getElementById("propertyPrice").value.trim();
  const address = document.getElementById("propertyAddress").value.trim();

  if (!name || !price || !address) {
    alert("Please fill all the fields.");
    return;
  }

  // Add new property item to property list
  const propertyId = Object.keys(propertyImages).length + 1;

  // For demo, create object URLs from uploaded files
  const imageUrls = uploadedFiles.map((file) => URL.createObjectURL(file));

  propertyImages[propertyId] = imageUrls;

  const newPropertyDiv = document.createElement("div");
  newPropertyDiv.classList.add("property-item");

  const img = document.createElement("img");
  img.src = imageUrls[0];
  img.alt = name;
  img.onclick = () => openGridGallery(propertyId);

  const detailsDiv = document.createElement("div");
  detailsDiv.classList.add("property-details");

  const textDiv = document.createElement("div");
  textDiv.classList.add("property-text");
  textDiv.innerHTML = `
    <div class="property-name">${name}</div>
    <div class="property-price">₹${Number(price).toLocaleString()}</div>
    <div class="property-address">${address}</div>
  `;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("property-buttons");

  const bookBtn = document.createElement("button");
  bookBtn.classList.add("book-btn");
  bookBtn.textContent = "Book Now";

  const whatsappLink = document.createElement("a");
  whatsappLink.classList.add("whatsapp-btn");
  whatsappLink.href = "https://wa.me/917409979678";
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.innerHTML = '<i class="fab fa-whatsapp"></i> WhatsApp';

  buttonsDiv.appendChild(bookBtn);
  buttonsDiv.appendChild(whatsappLink);

  detailsDiv.appendChild(textDiv);
  detailsDiv.appendChild(buttonsDiv);

  newPropertyDiv.appendChild(img);
  newPropertyDiv.appendChild(detailsDiv);

  propertyList.appendChild(newPropertyDiv);

  // Close popup and reset form
  closeUploadPopup();
});

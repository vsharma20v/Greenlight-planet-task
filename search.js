const unsplashURL =
  "https://api.unsplash.com/search/photos?per_page=10&client_id=URKsAr8K-4wgiqHCwrUic2hrFaoLpdBiXQX_9OA1lHc&";

export let abortController = new AbortController();
let photos = [];
let searchTerm = "";
const GRID_CELLS_HEIGHT = [9, 7, 5, 7, 5, 9, 5, 7, 7, 5];

const showPhotoModal = (e, modal, backdrop) => {
  const photo = e.target.cloneNode(true);
  photo.classList.add("modal-photo");
  modal.append(photo);
  modal.classList.add("visible");
  modal.classList.add("photo-modal");
  backdrop.classList.add("visible");
};

const showPhotosOnUI = (photosContainer, modal, backdrop) => {
  if (photos.length === 0 && searchTerm.length > 0) {
    const p = document.createElement("p");
    p.textContent = "No photo found.";
    photosContainer.append(p);
  } else if (photos.length > 0 && searchTerm.length > 0) {
    photos.forEach((photo, index) => {
      const div = document.createElement("div");
      div.classList.add("photo");
      div.classList.add(`span-${GRID_CELLS_HEIGHT[index]}`);
      div.id = photo.id;
      const img = document.createElement("img");
      img.src = photo.urls.regular;
      img.alt = photo.alt;
      div.append(img);
      div.addEventListener("click", (e) => showPhotoModal(e, modal, backdrop));
      photosContainer.append(div);
    });
  }
};

export const searchPhotos = (term, photosContainer, modal, backdrop) => {
  abortController = new AbortController();
  const url = unsplashURL + `query=${term}`;
  fetch(url, { signal: abortController.signal })
    .then((res) => {
      if (!res.ok) {
        console.error("Something went wrong! Couldn't fetch the photos.");
      }
      return res.json();
    })
    .then((data) => {
      searchTerm = term;
      const modifiedData = data.results.map((d) => ({
        id: d.id,
        alt: d.alt_description,
        urls: d.urls,
      }));
      photos = modifiedData;
      showPhotosOnUI(photosContainer, modal, backdrop);
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        console.error(err);
      }
    });
};

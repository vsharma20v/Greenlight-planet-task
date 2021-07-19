import { formSubmit } from "./form.js";
import { searchPhotos, abortController } from "./search.js";

const modalCloseBtn = document.querySelector(".modal-close-btn");
const backdrop = document.querySelector(".backdrop");
const modal = document.querySelector(".modal");
const contactBtn = document.querySelector(".contact-btn");
const aboutSection = document.querySelector(".about-section");
const searchInput = document.querySelector(".search");
const photosContainer = document.querySelector(".photos-container");
const template = document.createElement("template");
let modalForm = null;
let debounceTimer = null;
let isFetching = false;

template.innerHTML = `
  <form class="form">
    <input type="text" name="email" placeholder="Email" required title="Email must be a valid email address.">
    <input type="text" name="username" placeholder="Username" required title="Username must not contain spaces and special characters.">
    <input type="password" name="password" placeholder="Password" required title="Password must contain at least ten characters with at least one uppercase character and one special character.">
    <input type="password" name="reset-password" placeholder="Reset Password" required title="Reset password must be the same as the password.">
    <button type="submit" class="submit-btn">Submit</button>
  </form>
`;

const formSubmitHandler = (e) => {
  formSubmit(e, modal, backdrop, modalCloseHandler);
};

const modalCloseHandler = () => {
  modal.innerHTML = "";
  modal.append(modalCloseBtn);

  modal.classList.remove("visible");
  modal.classList.remove("photo-modal");
  backdrop.classList.remove("visible");
};

const contactBtnHandler = () => {
  modal.append(template.content.cloneNode(true));
  modalForm = modal.querySelector(".form");
  modalForm.addEventListener("submit", formSubmitHandler);
  modal.classList.add("visible");
  backdrop.classList.add("visible");
};

const searchPhotosHandler = (e) => {
  const searchTerm = e.target.value.trim();

  // debouncing and aborting the previous fetch request
  clearTimeout(debounceTimer);
  if (isFetching) {
    abortController.abort();
    isFetching = false;
  }
  debounceTimer = setTimeout(() => {
    isFetching = true;
    photosContainer.innerHTML = "";
    searchPhotos(searchTerm, photosContainer, modal, backdrop);
  }, 250);
};

aboutSection.append(template.content.cloneNode(true));

const form = aboutSection.querySelector(".form");

form.addEventListener("submit", formSubmitHandler);

modalCloseBtn.addEventListener("click", modalCloseHandler);

contactBtn.addEventListener("click", contactBtnHandler);

searchInput.addEventListener("input", searchPhotosHandler);

// registering service worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("./service-worker.js")
    .then((res) => {
      console.log(res.scope);
    })
    .catch((error) => {
      console.error(error.message);
    });
}

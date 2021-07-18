const sheetScriptURL =
  "https://script.google.com/macros/s/AKfycbwaSTPrWr9A0XWV9X0CFTY1ZKIuE65uS34jBnaPAmPIxPUTO7_ls9kpasMOIfv6G5b0/exec";

let reloadSec = 7;

const validateEmail = (email) => {
  const emailRegex = new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  );
  return emailRegex.test(email.trim());
};
const validateUserName = (userName) => {
  if (userName.includes(" ")) {
    return false;
  }
  const specialCharacterRegex = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  if (specialCharacterRegex.test(userName)) {
    return false;
  }
  return true;
};
const validatePasswordAndResetPassword = (password, resetPassword) => {
  const passwordRegex = new RegExp(
    "^(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{10,}"
  );
  if (password.trim() === resetPassword.trim()) {
    return passwordRegex.test(password.trim());
  } else return false;
};

const showSuccessModal = (modal, backdrop) => {
  const p = document.createElement("p");
  const div = document.createElement("div");
  div.classList.add("success-message");
  div.innerHTML = "<p>Thank you! Your data is submitted successfully.</p>";
  p.textContent = `Reloading page in 8 sec.`;
  div.append(p);
  const closeBtn = modal.children[0];
  modal.replaceChild(div, closeBtn);
  modal.classList.add("visible");
  backdrop.classList.add("visible");
  const intervalID = setInterval(() => {
    if (reloadSec > 0) {
      p.textContent = `Reloading page in ${reloadSec} sec.`;
      reloadSec--;
    }
  }, 1000);
  setTimeout(() => {
    modal.classList.remove("visible");
    backdrop.classList.remove("visible");
    clearInterval(intervalID);
    location.reload();
  }, 8000);
};

const showInValidModal = (modal, backdrop, message) => {
  const div = document.createElement("div");
  div.classList.add("danger-message");
  div.innerHTML = `<p>${message}</p>`;
  const closeBtn = modal.children[0];
  modal.replaceChild(div, closeBtn);
  modal.classList.add("visible");
  backdrop.classList.add("visible");

  setTimeout(() => {
    modal.classList.remove("visible");
    backdrop.classList.remove("visible");
  }, 2000);
};

export const formSubmit = (e, modal, backdrop, modalCloseHandler) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const email = formData.get("email");
  const username = formData.get("username");
  const password = formData.get("password");
  const resetPassword = formData.get("reset-password");
  const emailIsValid = validateEmail(email);
  const usernameIsValid = validateUserName(username);
  const passwordAndResetPasswordIsValid = validatePasswordAndResetPassword(
    password,
    resetPassword
  );

  const formIsVaild =
    emailIsValid && usernameIsValid && passwordAndResetPasswordIsValid;

  if (formIsVaild) {
    fetch(sheetScriptURL, {
      method: "POST",
      body: formData,
    })
      .then(() => {
        e.target.reset();
        modalCloseHandler();
        showSuccessModal(modal, backdrop);
      })
      .catch((error) => console.error(error));
  } else {
    if (!emailIsValid && usernameIsValid && passwordAndResetPasswordIsValid) {
      showInValidModal(modal, backdrop, "Email is invalid.");
    } else if (
      !usernameIsValid &&
      emailIsValid &&
      passwordAndResetPasswordIsValid
    ) {
      showInValidModal(modal, backdrop, "Username is invalid.");
    } else if (
      !passwordAndResetPasswordIsValid &&
      emailIsValid &&
      usernameIsValid
    ) {
      showInValidModal(
        modal,
        backdrop,
        "Password and reset password are invalid."
      );
    } else {
      showInValidModal(modal, backdrop, "All fields are invalid.");
    }
  }
};

export const setStatus = (code, message) => {
  const $status = document.querySelector("[data-status] strong");

  $status.dataset.status = code;
  $status.textContent = message;
};

export const toggleDetails = (flag = true) => {
  const $details = document.querySelector(".form__header");


  if (flag) {
    $details.classList.remove("d-none");
  } else {
    $details.classList.add("d-none");
  }
};
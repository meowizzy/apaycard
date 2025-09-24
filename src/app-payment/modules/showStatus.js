export const setDetails = ({
  title,
  payment,
  amount,
  status
}) => {
  const $details = document.querySelector(".form__header-bot");
  const $title = document.querySelector(".form__header-top .form__title");
  const $payment = document.querySelector(`[data-details-type="payment"] strong`);
  const $amount = document.querySelector(`[data-details-type="amount"] strong`);
  const $status = document.querySelector("[data-status]");

  $details.classList.remove("d-none");

  if (title) $title.textContent = title;
  if (payment) $payment.textContent = payment;
  if (amount) $amount.textContent = amount;

  if (status) {
    $status.dataset.status = status.code;
    $status.children[1].textContent = status.message;
  }
};

export const toggleDetails = (flag = true) => {
  const $details = document.querySelector(".form__header");

  if (flag) {
    $details.classList.remove("d-none");
  } else {
    $details.classList.add("d-none");
  }
};
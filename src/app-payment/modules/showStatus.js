import { translate } from "../../localization";

export const setDetails = ({ title, payment, amount, status }) => {
  const $details = document.querySelector(".form__header-bot");
  const $title = document.querySelector(
    ".form__header .form__header-merchant .form__header-col-value",
  );
  const $payment = document.querySelector(
    `[data-details-type="payment"] .form__header-col-value`,
  );
  const $amount = document.querySelector(
    `[data-details-type="amount"] .form__amount-sum`,
  );
  const $status = document.querySelector("[data-status]");

  $details.classList.remove("d-none");

  if (title) $title.textContent = title;
  if (payment) $payment.textContent = payment;
  if (amount)
    $amount.innerHTML = `${amount} <span class="currency">${translate("fields.SUM")}</span>`;

  if (status) {
    $status.dataset.status = status.code;
    $status.children[1].textContent = status.message;
  }
};

export const toggleDetails = (flag = true) => {
  const $details = document.querySelector(".form__header");
  const $amount = $details.nextElementSibling;

  if (flag) {
    $details.classList.remove("d-none");
    $amount.classList.remove("d-none");
  } else {
    $details.classList.add("d-none");
    $amount.classList.add("d-none");
  }
};

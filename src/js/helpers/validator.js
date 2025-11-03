import { translate } from "../../localization";

const isValidCardExpire = (cardExp) => {
  const [month, year] = cardExp.split(" / ");
  const exp = cardExp.replace(/[/\s]+/g, "");

  return exp.length === 4 && Number(month) >= 1 && Number(year) >= 25;
};

const isValidCardNumber = (cardNumber) => {
  return cardNumber.split(" ").join("").length === 16;
};

const isValidPhoneNumber = (phoneNumber) => {
  return phoneNumber.length === 19;
};

const pasteError = (input, msg) => {
  const parent = input.closest(".form__field");
  const errorDest = parent.querySelector(".form__field-label");
  const existError = parent.querySelector(".error");
  const errorMsg = document.createElement("span");

  if (existError) {
    existError.remove();
  }

  parent.classList.add("form__field--error");
  errorMsg.textContent = msg;

  errorMsg.classList.add("error");
  errorDest.append(errorMsg);
};

const removeError = (input) => {
  const parent = input.closest(".form__field");
  const error = parent.querySelector(".error");

  parent.classList.remove("form__field--error");

  if (error) {
    error.remove();
  }
};

export const formValidate = (inputs) => {
  inputs.forEach((input) => {
    switch (input.name) {
      case "phone":
        if (!isValidPhoneNumber(input.value)) {
          pasteError(input, translate("validateErrors.phoneNumberIncorrect"));
        } else {
          removeError(input);
        }
        break;
      case "cardNumber":
        if (!isValidCardNumber(input.value)) {
          input.classList.add("input-error");
          pasteError(input, translate("validateErrors.cardNumberIncorrect"));
        } else {
          input.classList.remove("input-error");
          if (!input.nextElementSibling.classList.contains("input-error")) {
            removeError(input);
          }
        }
        break;
      case "cardExpire":
        if (!isValidCardExpire(input.value)) {
          input.classList.add("input-error");
          pasteError(input, translate("validateErrors.cardExpIncorrect"));
        } else {
          input.classList.remove("input-error");
          if (!input.previousElementSibling.classList.contains("input-error")) {
            removeError(input);
          }
        }
        break;
      case "cvv":
        if (!input.value) {
          input.classList.add("input-error");
        } else {
          input.classList.remove("input-error");
          if (!input.previousElementSibling.classList.contains("input-error")) {
            removeError(input);
          }
        }
        break;
    }
  });
};

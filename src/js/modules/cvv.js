import { $request } from "../libs/request";
import { toastError } from "../helpers/toastify";
import { debounce } from "../libs/debounce";

export const cvv = () => {
  const cardNumberInput = document.querySelector(".form__field-card .input-card");
  const cvvField = document.querySelector(".form__field-cvv");
  const cvvInput = cvvField.querySelector("input");
  const phoneField = document.querySelector(".form__field-phone");
  const phoneInput = phoneField.querySelector("input");

  const checkCardNumber = async (cardNumber) => {
    try {
      return await $request({
        url: "/web/v1/bills/check/cvv",
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pan: cardNumber,
        })
      });
    } catch (e) {
      toastError(e.message);
      phoneField.classList.add("d-none");
    }
  };

  const onCardNumberChange = debounce(async (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length >= 8) {
      const result = await checkCardNumber(value);

      if (result?.cvv) {
        cvvField.classList.remove("d-none");
        cvvInput.removeAttribute("disabled");

        phoneField.classList.add("d-none");
        phoneInput.value = "";
      } else {
        if (result) {
          cvvField.classList.add("d-none");
          cvvInput.setAttribute("disabled", "disabled");
          cvvInput.value = "";
          phoneField.classList.remove("d-none");
        }
      }
    } else {
      cvvField.classList.add("d-none");
      cvvInput.setAttribute("disabled", "disabled");
      cvvInput.value = "";
      phoneField.classList.add("d-none");
      phoneInput.value = "";
    }
  }, 500);

  cardNumberInput.addEventListener("input", onCardNumberChange);
};
import { $request } from "../../js/libs/request";
import { toastError } from "../../js/helpers/toastify";
import { debounce } from "../../js/libs/debounce";

export const cvv = () => {
  const cardNumberInput = document.querySelector(
    ".form__field-card .input-card",
  );
  const cvvField = document.querySelector(".form__field-cvv");
  const cvvInput = cvvField.querySelector("input");

  const checkCardNumber = async (cardNumber) => {
    try {
      return await $request({
        url: "/web/v1/bills/check/cvv",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pan: cardNumber,
        }),
      });
    } catch (e) {
      toastError(e.message);
    }
  };

  const onCardNumberChange = debounce(async (e) => {
    const value = e.target.value.replace(/\D/g, "");

    if (value.length >= 8) {
      const result = await checkCardNumber(value);

      if (result?.cvv) {
        cvvField.classList.remove("d-none");
        cvvInput.removeAttribute("disabled");
      } else {
        if (result) {
          cvvField.classList.add("d-none");
          cvvInput.setAttribute("disabled", "disabled");
          cvvInput.value = "";
        }
      }
    } else {
      cvvField.classList.add("d-none");
      cvvInput.setAttribute("disabled", "disabled");
      cvvInput.value = "";
    }
  }, 500);

  cardNumberInput.addEventListener("input", onCardNumberChange);
};

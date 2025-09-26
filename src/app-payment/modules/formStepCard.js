import { toastError } from "../../js/helpers/toastify";
import { showStep } from "../../js/helpers/showStep";
import { $request } from "../../js/libs/request";
import { SEARCH_PARAMS } from "../../js/app/constants";
import { formValidate } from "../../js/helpers/validator";
import { renderMerchantPhone } from "./renderMerchantPhone";
import { formStepCode } from "./formStepCode";

export const formStepCard = () => {
  const form = document.querySelector("[data-step='card'] form");
  const submitButton = form.querySelector(".lp-button");
  const billId = SEARCH_PARAMS.get("billId");

  const sendData = async (data) => {
    submitButton.classList.add("loading");

    const { cardNumber, cardExpire } = data;

    const unFormattedCardNumber = cardNumber.replace(/\s/g, "");
    const unFormattedCardExpire = cardExpire.replace(/\D/g, "");

    sessionStorage.setItem("cardNumber", unFormattedCardNumber);
    sessionStorage.setItem("cardExpire", unFormattedCardExpire);

    try {
      const data = await $request({
        url: "/web/v1/bills/update",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          expiry: unFormattedCardExpire,
          pan: unFormattedCardNumber,
        }),
      });

      // const data = {
      //   ownerPhone: "+998901667739",
      // };

      if (data) {
        if (data.formUrl) {
          const trans_id = SEARCH_PARAMS.get("trans_id");

          localStorage.setItem("trans_id", trans_id);
          location.href = data.formUrl;
          return;
        }

        form.reset();

        sessionStorage.setItem("phone", data.ownerPhone);
        renderMerchantPhone(data.ownerPhone);
        showStep("code");
        formStepCode();
        form.removeEventListener("submit", onClickSubmit);
      }
    } catch (e) {
      toastError(e.message);
    } finally {
      submitButton.classList.remove("loading");
    }
  };

  function onClickSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const cardNumber = formData.get("cardNumber");
    const cardExpire = formData.get("cardExpire");
    const inputs = form.querySelectorAll("input");

    formValidate(inputs);

    const hasError = form.querySelector(".form__field--error");

    if (!hasError) {
      sendData({
        cardNumber,
        cardExpire,
      });
    }
  }

  form.addEventListener("submit", onClickSubmit);
};

import {Otp} from "../../js/libs/otpClass";
import {translate} from "../../localization";
import {$request} from "../../js/libs/request";
import {showStep} from "../../js/helpers/showStep";
import {SEARCH_PARAMS} from "../../js/app/constants";
import {checkBillId} from "./checkBillId";

export const formStepCode = () => {
  const step = document.querySelector("[data-step='code']");
  const form = step.querySelector("form");
  const errorElement = document.createElement("span");
  errorElement.classList.add("error");
  const billId = SEARCH_PARAMS.get("billId");

  let isBlocked = false;

  if (!form) {
    return;
  }

  const otpInstance = new Otp(".form__field-code");
  const otpCodeInput = form.querySelector("input[name='otpValue']");
  const otpCodeField = otpCodeInput.closest(".form__field");
  const otpCodeLabel = otpCodeField.querySelector(".form__field-label");
  const cancelButton = form.querySelector(".cancel");

  const sendRequest = async () => {
    if (isBlocked) {
      return;
    }

    const otpCode = otpCodeInput.value;
    otpCodeField.classList.add("disabled");

    if (otpCode.length !== 6) {
      otpCodeField.classList.add("form__field--error");
      errorElement.textContent = translate("incorrectValue");
      otpCodeLabel.append(errorElement);
      return;
    }

    otpCodeField.classList.remove("form__field--error");
    // errorElement.remove();

    try {
      const data = await $request({
        url: "/web/v1/bills/pay",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          confirmationKey: otpCode,
        })
      });

      if (data) {
        const redirectUrl = sessionStorage.getItem("redirectUrl");

        setTimeout(() => {
          checkBillId("SMS_INPUT");

          if (redirectUrl) {
            location.href = redirectUrl;
          }
        }, 4000);

        // toastSuccess(translate("success.cardActivated"));
        // showStep("success");
      }
    } catch (e) {
      // toastError(e.message);
      isBlocked = true;
      setTimeout(() => {
        isBlocked = false;
      }, 5000);
      otpCodeField.classList.add("form__field--error");
      errorElement.textContent = e.message;
      otpCodeLabel.append(errorElement);
    } finally {
      otpCodeField.classList.remove("disabled");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    showStep("card");
  };

  otpInstance.onFilled((isFilled) => {
    if (isFilled) {
      sendRequest();
    } else {
      otpCodeField.classList.remove("form__field--error");
      errorElement.remove();
    }
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    e.stopPropagation();
  });

  cancelButton.addEventListener("click", handleCancel);
};
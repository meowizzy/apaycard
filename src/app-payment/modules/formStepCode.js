import { Otp } from "../../js/libs/otpClass";
import { translate } from "../../localization";
import { $request } from "../../js/libs/request";
import { SEARCH_PARAMS } from "../../js/app/constants";
import { checkBillId } from "./checkBillId";
import { renderLoadingStep } from "./renderLoadingStep";
import { toastError, toastSuccess } from "../../js/helpers/toastify";
import { setCountdown } from "../../js/libs/countDown";
import { formStepCard } from "./formStepCard";
import { showStepPayments } from "./showStep";
import {renderMerchantPhone} from "./renderMerchantPhone";

const resendCode = () => {
  sessionStorage.removeItem("countDown");
  const billId = SEARCH_PARAMS.get("billId");
  const cardNumber = sessionStorage.getItem("cardNumber");
  const cardExpire = sessionStorage.getItem("cardExpire");

  if (!cardNumber && !cardExpire && !billId) {
    toastError("Card number and card expire weren't entered");
    return;
  }

  return $request({
    withoutResponse: true,
    url: "/web/v1/bills/resend-activation-code",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      billId,
      expiry: cardExpire,
      pan: cardNumber,
    }),
  });
};

export const formStepCode = (ctx = null) => {
  const step = document.querySelector("[data-step='code']");
  const merchantPhone = sessionStorage.getItem("phone");
  const form = step.querySelector("form");
  const errorElement = document.createElement("span");
  const billId = SEARCH_PARAMS.get("billId");

  errorElement.classList.add("error");

  let isBlocked = false;

  if (merchantPhone && ctx === "SESSION_NOT_FINISHED") {
    renderMerchantPhone(merchantPhone);
  }

  if (!form) {
    return;
  }

  const otpInstance = new Otp(".form__field-code");
  const otpCodeInput = form.querySelector("input[name='otpValue']");
  const otpCodeField = otpCodeInput.closest(".form__field");
  const otpCodeErrors = otpCodeField.querySelector(".form__field-errors");
  const cancelButton = step
    .closest(".form")
    .querySelector("[data-step-code='code'] .cancel");
  const submitButton = step.querySelector(
    ".form__field-buttons .lp-button.primary",
  );
  const codeStepFormField = step.querySelector(".form__field");
  const resendButton = step.querySelector(".resend");
  const countDown = sessionStorage.getItem("countDown");
  const countDownDuration = 60;

  const onFinishCountDown = () => {
    resendButton.removeAttribute("disabled");
    resendButton.children[0].textContent = translate("resend");
    resendButton.addEventListener("click", onClickResendButton);
    sessionStorage.removeItem("countDown");
  };

  const countDownInstance = setCountdown({
    duration: countDownDuration,
    dest: resendButton.children[0],
    timeFormat: (time) => translate("buttons.resendTimeProgress", time),
    onFinish: onFinishCountDown,
  });

  const windowBeforeUnloadHandler = function () {
    sessionStorage.setItem("countDown", countDownInstance.getTimeLeft());
  };

  window.addEventListener("beforeunload", windowBeforeUnloadHandler);

  if (countDown) {
    countDownInstance.start(Number(countDown));
  } else {
    countDownInstance.start();
  }

  async function onClickResendButton(e) {
    e.preventDefault();

    codeStepFormField.classList.remove("form__field--error");
    step.querySelector("form").reset();

    const codeStemFormFieldErrorMessage =
      codeStepFormField.querySelector(".error");

    if (codeStemFormFieldErrorMessage) {
      codeStemFormFieldErrorMessage.remove();
    }

    try {
      resendButton.classList.add("loading");

      await resendCode();

      toastSuccess(translate("success.codeSent"));
      // renderCountDown();
      countDownInstance.start(countDownDuration);
      resendButton.removeEventListener("click", onClickResendButton);
      resendButton.setAttribute("disabled", "true");
    } catch (e) {
      toastError(e.message);
    } finally {
      resendButton.classList.remove("loading");
    }
  }

  const resets = () => {
    countDownInstance.stop();
    otpInstance.destroy();
    cancelButton.removeEventListener("click", handleCancel);
    form.removeEventListener("submit", otpFormHandler);
    window.removeEventListener("beforeunload", windowBeforeUnloadHandler);
    sessionStorage.clear();
  };

  const sendRequest = async () => {
    // if (isBlocked) {
    //   return;
    // }

    submitButton.classList.add("loading");
    otpCodeField.classList.add("disabled");

    const otpCode = otpCodeInput.value;

    if (otpCode.length !== 6) {
      otpCodeField.classList.add("form__field--error");
      errorElement.textContent = translate("incorrectValue");
      otpCodeErrors.append(errorElement);
      return;
    }

    otpCodeField.classList.remove("form__field--error");

    try {
      renderLoadingStep(translate("paymentProcessing"));
      // const data = await $request({
      //   url: "/web/v1/bills/pay",
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     billId,
      //     confirmationKey: otpCode,
      //   }),
      // });

      const data = new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      });

      if (data) {
        const redirectUrl = sessionStorage.getItem("redirectUrl");

        resets();

        setTimeout(() => {
          checkBillId("SMS_INPUT", "CANCELED");

          if (redirectUrl) {
            location.href = redirectUrl;
          }
        }, 4000);
      }
    } catch (e) {
      const step = sessionStorage.getItem("step");

      if (step !== "code") {
        showStepPayments("code");
      }

      // isBlocked = true;
      // setTimeout(() => {
      //   isBlocked = false;
      // }, 5000);
      otpCodeField.classList.add("form__field--error");
      errorElement.textContent = e.message;

      otpCodeErrors.append(errorElement);
    } finally {
      otpCodeField.classList.remove("disabled");
      submitButton.classList.remove("loading");
    }
  };

  const otpFormHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    sendRequest();
  };

  const handleCancel = (e) => {
    e.preventDefault();
    otpCodeField.classList.remove("form__field--error");

    if (errorElement) {
      errorElement.remove();
    }

    resets();

    showStepPayments("card");
    formStepCard();
  };

  otpInstance.onFilled((isFilled) => {
    if (isFilled) {
      // sendRequest();
    } else {
      otpCodeField.classList.remove("form__field--error");
      errorElement.remove();
    }
  });

  form.addEventListener("submit", otpFormHandler);

  cancelButton.addEventListener("click", handleCancel);
};

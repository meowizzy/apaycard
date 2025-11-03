import { Otp } from "../../js/libs/otpClass";
import { translate } from "../../localization";
import { $request } from "../../js/libs/request";
import { showStep } from "../../js/helpers/showStep";
import { SEARCH_PARAMS } from "../../js/app/constants";
import { checkBillId } from "./checkBillId";
import { renderLoadingStep } from "./renderLoadingStep";
import { toastError, toastSuccess } from "../../js/helpers/toastify";
import { setCountdown } from "../../js/libs/countDown";
import { formStepCard } from "./formStepCard";

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
  const codeStep = document.querySelector("[data-step='code']");
  const codeStepFormField = codeStep.querySelector(".form__field");
  const resendButton = codeStep.querySelector(".resend");
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
    codeStep.querySelector("form").reset();

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

  const otpFormHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const sendRequest = async () => {
    // if (isBlocked) {
    //   return;
    // }

    const otpCode = otpCodeInput.value;
    otpCodeField.classList.add("disabled");

    if (otpCode.length !== 6) {
      otpCodeField.classList.add("form__field--error");
      errorElement.textContent = translate("incorrectValue");
      otpCodeLabel.append(errorElement);
      return;
    }

    otpCodeField.classList.remove("form__field--error");

    try {
      renderLoadingStep(translate("paymentProcessing"));
      const data = await $request({
        url: "/web/v1/bills/pay",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          confirmationKey: otpCode,
        }),
      });

      if (data) {
        const redirectUrl = sessionStorage.getItem("redirectUrl");

        setTimeout(() => {
          checkBillId("SMS_INPUT");

          if (redirectUrl) {
            location.href = redirectUrl;
          }
        }, 4000);
      }
    } catch (e) {
      const step = sessionStorage.getItem("step");

      if (step !== "code") {
        showStep("code");
      }

      // isBlocked = true;
      // setTimeout(() => {
      //   isBlocked = false;
      // }, 5000);
      otpCodeField.classList.add("form__field--error");
      errorElement.textContent = e.message;
      otpCodeLabel.append(errorElement);
    } finally {
      otpCodeField.classList.remove("disabled");
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    otpCodeField.classList.remove("form__field--error");

    if (errorElement) {
      errorElement.remove();
    }

    countDownInstance.stop();
    otpInstance.destroy();
    cancelButton.removeEventListener("click", handleCancel);
    form.removeEventListener("submit", otpFormHandler);
    window.removeEventListener("beforeunload", windowBeforeUnloadHandler);
    sessionStorage.clear();

    showStep("card");
    formStepCard();
  };

  otpInstance.onFilled((isFilled) => {
    if (isFilled) {
      sendRequest();
    } else {
      otpCodeField.classList.remove("form__field--error");
      errorElement.remove();
    }
  });

  form.addEventListener("submit", otpFormHandler);

  cancelButton.addEventListener("click", handleCancel);
};

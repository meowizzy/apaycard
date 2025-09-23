import {toastError} from "../../js/helpers/toastify";
import {showStep} from "../../js/helpers/showStep";
import {$request} from "../../js/libs/request";
import { setCountdown } from "../../js/libs/countDown";
import { translate } from "../../localization";
import { hideNumber } from "../../js/helpers/hideNumber";
import { SEARCH_PARAMS } from "../../js/app/constants";
import { formValidate } from "../../js/helpers/validator";

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
    })
  });
};

export const formStepCard = () => {
  const form = document.querySelector("[data-step='card'] form");
  const submitButton = form.querySelector(".lp-button");
  const codeStep = document.querySelector("[data-step='code']");
  const resendButton = codeStep.querySelector(".resend");
  const codeStepFormField = codeStep.querySelector(".form__field");
  const codeStepFormDesc = codeStep.querySelector(".form__body-desc");
  const countDown = sessionStorage.getItem("countDown");
  const billId = SEARCH_PARAMS.get("billId");

  const renderCodeStepDesc = (phone = sessionStorage.getItem("phone")) => {
    codeStepFormDesc.textContent = translate("smsConfirmationDescription", hideNumber({
      phone,
      elemsHide: 5,
      sliceFromBack: 2
    }));
  };

  renderCodeStepDesc();

  const renderCountDown = (count = 60) => {
    setCountdown({
      duration: count,
      dest: resendButton.children[0],
      onFinish: onFinishCountDown,
      onUpdate: (time) => {
        sessionStorage.setItem("countDown", time);
      },
    });
  };

  const onClickResendButton = async (e) => {
    e.preventDefault();

    codeStepFormField.classList.remove("form__field--error");
    codeStep.querySelector("form").reset();

    const codeStemFormFieldErrorMessage = codeStepFormField.querySelector(".error");

    if (codeStemFormFieldErrorMessage) {
      codeStemFormFieldErrorMessage.remove();
    }

    try {
      resendButton.classList.add("loading");

      await resendCode();

      toastSuccess(translate("success.codeSent"));
      renderCountDown();
      resendButton.removeEventListener("click", onClickResendButton);
      resendButton.setAttribute("disabled", "true");

    } catch (e) {
      toastError(e.message);
    } finally {
      resendButton.classList.remove("loading");
    }
  };

  const onFinishCountDown = () => {
    resendButton.removeAttribute("disabled");
    resendButton.children[0].textContent = translate("resend");
    resendButton.addEventListener("click", onClickResendButton);
    sessionStorage.removeItem("countDown");
  };

  if (countDown) {
    renderCountDown(Number(countDown));
  } else {
    onFinishCountDown();
  }

  const sendData = async (data) => {
    submitButton.classList.add("loading");

    const {
      cardNumber,
      cardExpire
    } = data;

    sessionStorage.setItem("cardNumber", cardNumber);
    sessionStorage.setItem("cardExpire", cardExpire);

    try {
      const data = await $request({
        url: "/web/v1/bills/update",
        method: 'PUT',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          billId,
          expiry: cardExpire.replace(/\D/g, ""),
          pan: cardNumber.replace(/\s/g, ''),
        })
      });

      if (data) {
        if (data.formUrl) {
          const trans_id = SEARCH_PARAMS.get("trans_id");

          localStorage.setItem("trans_id", trans_id);
          location.href = data.formUrl;
          return;
        }

        form.reset();
        renderCountDown();
        resendButton.removeEventListener("click", onClickResendButton);
        renderCodeStepDesc(data.ownerPhone);
        showStep("code");
      }
    } catch (e) {
      toastError(e.message);
    } finally {
      submitButton.classList.remove("loading");
    }
  };

  const onClickSubmit = (e) => {
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
        cardExpire
      });
    }
  };

  form.addEventListener("submit", onClickSubmit);
};
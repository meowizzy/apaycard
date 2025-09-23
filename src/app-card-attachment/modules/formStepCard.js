import { toastError } from "../../js/helpers/toastify";
import { showStep } from "../../js/helpers/showStep";
import { $request } from "../../js/libs/request";
import { setCountdown } from "../../js/libs/countDown";
import { translate } from "../../localization";
import { hideNumber } from "../../js/helpers/hideNumber";
import { formValidate } from "../../js/helpers/validator";

const resendCode = () => {
    sessionStorage.removeItem("countDown");
    return $request({
        withoutResponse: true,
        url: "/web/v1/bills/card/resend-activation-code",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            extId: sessionStorage.getItem("extId"),
        })
    });
};

export const formStepCard = () => {
    const form = document.querySelector("[data-step='card'] form");
    const submitButton = form.querySelector(".lp-button");
    const error = form.parentElement.querySelector(".form__body-error");
    const codeStep = document.querySelector("[data-step='code']");
    const resendButton = codeStep.querySelector(".resend");
    const codeStepFormField = codeStep.querySelector(".form__field");
    const codeStepFormDesc = codeStep.querySelector(".form__body-desc");
    const countDown = sessionStorage.getItem("countDown");

    const renderCodeStepDesc = () => {
        codeStepFormDesc.textContent = translate("smsConfirmationDescription", hideNumber({
            phone: sessionStorage.getItem("phone"),
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
            phone,
            cardNumber,
            cardExpire
        } = data;

        try {
            const data = await $request({
                url: "/web/v1/bills/card",
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    expiry: cardExpire.replace(/\D/g, ""),
                    pan: cardNumber.replace(/\s/g, ''),
                    phone: phone.replace(/\D/g, ''),
                    extId: sessionStorage.getItem("extId"),
                })
            });

            if (data) {
                form.reset();
                renderCountDown();
                resendButton.removeEventListener("click", onClickResendButton);
                renderCodeStepDesc();
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
        const phone = formData.get("phone");
        const cardNumber = formData.get("cardNumber");
        const cardExpire = formData.get("cardExpire");
        const inputs = form.querySelectorAll("input");

        formValidate(inputs);

        const hasError = form.querySelector(".form__field--error");

        if (!hasError) {
            sessionStorage.setItem("phone", phone.replace(/[-()]+/g, ' '));

            sendData({
                phone,
                cardNumber,
                cardExpire
            });
        }
    };

    form.addEventListener("submit", onClickSubmit);
};
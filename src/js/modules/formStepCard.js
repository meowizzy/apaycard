import { BASE_URL } from "../app/constants";
import { showStep } from "../helpers/showStep";
import { translate } from "../../localization";
import {toastError, toastSuccess} from "../helpers/toastify";
import { setCountdown } from "../libs/countDown";
import {hideNumber} from "../helpers/hideNumber";
import {$request} from "../libs/request";

const cardCodes = [
    8600,
    9860,
    5614
];

const isValidCardNumber = (cardNumber) => {
    const [ cardCode ] = cardNumber.split(" ");
    const card = cardNumber.replace(/\s/g, '');
    const isValidCode = !!cardCodes.find((code) => code === Number(cardCode));

    return card.length === 16 && isValidCode;
};

const isValidCardExpire = (cardExp) => {
    const exp = cardExp.replace(/[/\s]+/g, '');

    return exp.length === 4;
};

const isValidPhoneNumber = (phoneNumber) => {
    return phoneNumber.length === 19;
};

const resendCode = () => {
    sessionStorage.removeItem("countDown");
    return $request({
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

    const renderCountDown = () => {
        setCountdown({
            duration: Number(countDown) || 60,
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

            const response = await resendCode();

            if (response.status === 200) {
                toastSuccess(translate("success.codeSent"));
                renderCountDown();
                resendButton.removeEventListener("click", onClickResendButton);
                resendButton.setAttribute("disabled", "true");
            } else {
                const res = await response.json();

                if (res?.detail) {
                    throw new Error(res?.detail);
                }
            }
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
        renderCodeStepDesc();
        renderCountDown();
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
            const response = await $request({
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

            if (response.status === 200) {
                form.reset();
                renderCountDown();
                renderCodeStepDesc();
                showStep("code");
            } else {
                const res = await response.json();

                if (res?.detail) {
                    throw new Error(res?.detail);
                }
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

        const isPhoneInputValid = isValidPhoneNumber(phone);
        const isCardNumberInputValid = isValidCardNumber(cardNumber);
        const isCardExpireInputValid = isValidCardExpire(cardExpire);

        if (isPhoneInputValid && isCardNumberInputValid && isCardExpireInputValid) {
            error.classList.add("d-none");

            sessionStorage.setItem("phone", phone.replace(/[-()]+/g, ' '));

            sendData({
                phone,
                cardNumber,
                cardExpire
            });
        } else {
            error.classList.remove("d-none");
            error.textContent = translate("validateErrors.checkEnteredData");
        }
    };

    form.addEventListener("submit", onClickSubmit);
};
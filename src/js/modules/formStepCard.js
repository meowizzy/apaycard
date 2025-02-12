import { BASE_URL } from "../app/constants";
import { showStep } from "../helpers/showStep";
import { translate } from "../../localization";
import {toastError, toastSuccess} from "../helpers/toastify";
import { setCountdown } from "../libs/countDown";

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

const resendCode = async () => {
    await fetch(`${BASE_URL}/web/v1/bills/card/resend-activation-code`, {
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

    const renderCountDown = () => {
        setCountdown(30, resendButton.children[0], onFinishCountDown);
    };

    const onClickResendButton = async (e) => {
        e.preventDefault();

        try {
            resendButton.classList.add("loading");

            await resendCode();

            toastSuccess(translate("success.codeSent"));

            renderCountDown();

            resendButton.removeEventListener("click", onClickResendButton);
            resendButton.setAttribute("disabled");
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
    };

    const sendData = async (data) => {
        submitButton.classList.add("loading");
        renderCountDown();

        const {
            phone,
            cardNumber,
            cardExpire
        } = data;

        try {
            const response = await fetch(`${BASE_URL}/web/v1/bills/card`, {
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
                sessionStorage.setItem("phone", phone.replace(/[-()]+/g, ' '));
                form.reset();
                showStep("code");
            } else if (response.status === 400) {
                throw new Error(translate("errors.timeoutException"));
            } else if (response.status >= 401 && response.status <= 403) {
                throw new Error(translate("errors.incorrectDataEntered"));
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
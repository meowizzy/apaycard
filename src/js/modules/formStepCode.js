import { translate } from "../../localization";
import { showStep } from "../helpers/showStep";
import { toastError, toastSuccess } from "../helpers/toastify";
import { Otp } from "./otpClass";
import {$request} from "../libs/request";
import {setCountdown} from "../libs/countDown";

export const formStepCode = () => {
    const step = document.querySelector("[data-step='code']");
    const form = step.querySelector("form");
    const errorElement = document.createElement("span");
    errorElement.classList.add(".error");

    if (!form) {
        return;
    }

    const otpInstance = new Otp(".form__field-code");
    const otpCodeInput = form.querySelector("input[name='otpValue']");
    const otpCodeField = otpCodeInput.closest(".form__field");
    const otpCodeLabel = otpCodeField.querySelector(".form__field-label");
    const cancelButton = form.querySelector(".cancel");

    const sendRequest = async () => {
        const otpCode = otpCodeInput.value;
        otpCodeField.classList.add("disabled");

        if (otpCode.length !== 6) {
            otpCodeField.classList.add("form__field--error");
            errorElement.textContent = translate("incorrectValue");
            otpCodeLabel.append(errorElement);
            return;
        }

        otpCodeField.classList.remove("form__field--error");
        errorElement.remove();

        try {
            otpCodeField.classList.remove("form__field--error");
            errorElement.remove();

            const response = await $request({
                url: "/web/v1/bills/card/activate",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    extId: sessionStorage.getItem("extId"),
                    key: otpCode,
                })
            });

            const res = await response.json();

            if (response.status === 200) {
                toastSuccess(translate("success.cardActivated"));
                showStep("success");
            } else if (response.status === 400) {
                otpCodeField.classList.add("form__field--error");
                errorElement.textContent = res?.detail;
                otpCodeLabel.append(errorElement);
                throw new Error(res?.detail);
            } else if (response.status === 401 || response.status === 403) {
                throw new Error(res?.detail);
            }
        } catch (e) {
            if (e.status) {
                toastError(e.message);
            }
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
            errorElement?.remove();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    cancelButton.addEventListener("click", handleCancel);
};
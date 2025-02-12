import { translate } from "../../localization";
import { showStep } from "../helpers/showStep";
import { hideNumber } from "../helpers/hideNumber";
import { BASE_URL } from "../app/constants";
import { toastError, toastSuccess } from "../helpers/toastify";
import { renderError } from "../helpers/renderError";
import { Otp } from "./otpClass";

export const formStepCode = () => {
    const step = document.querySelector("[data-step='code']");
    const form = step.querySelector("form");
    const errorElement = document.createElement("span");

    if (!form) {
        return;
    }

    const formDesc = step.querySelector(".form__body-desc");
    const cancelButton = form.querySelector(".cancel");
    const phoneFromSessionStorage = sessionStorage.getItem("phone");

    const otpInstance = new Otp(".form__field-code");

    formDesc.textContent = translate("smsConfirmationDescription", hideNumber({
        phone: phoneFromSessionStorage,
        elemsHide: 5,
        sliceFromBack: 2
    }));

    const sendRequest = async () => {
        const otpCodeInput = form.querySelector("input[name='otpValue']");
        const otpCodeField = otpCodeInput.closest(".form__field");
        const otpCodeLabel = otpCodeField.querySelector(".form__field-label");
        const otpCode = otpCodeInput.value;

        if (otpCode.length !== 6) {
            otpCodeField.classList.add("form__field--error");
            errorElement.textContent = translate("incorrectValue");
            otpCodeLabel.append(errorElement);
            return;
        }

        otpCodeField.classList.remove("form__field--error");
        errorElement.remove();

        try {
            form.querySelector(".form__field").classList.add("disabled");

            const response = await fetch(`${BASE_URL}/web/v1/bills/card/activate`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    extId: sessionStorage.getItem("extId"),
                    key: otpCode,
                })
            });

            if (response.status === 200) {
                toastSuccess(translate("success.cardActivated"));
                showStep("success");
            } else if (response.status === 400 || response.status === 401 || response.status === 403) {
                throw new Error({
                    status: response.status,
                    message: translate("warnings.cardAlreadyActivated")
                });
            }
        } catch (e) {
            if (e.status) {
                toastError(e.message);
            } else {
                renderError(translate("errors.attachmentError"));
            }
        } finally {
            form.querySelector(".form__field").classList.remove("disabled");
        }
    };

    const handleCancel = (e) => {
        e.preventDefault();
        showStep("card");
    };

    otpInstance.onFilled((isFilled) => {
        if (isFilled) {
            sendRequest();
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
    cancelButton.addEventListener("click", handleCancel);
};
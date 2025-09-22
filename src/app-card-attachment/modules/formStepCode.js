import {Otp} from "../../js/libs/otpClass";
import {translate} from "../../localization";
import {$request} from "../../js/libs/request";
import {toastSuccess} from "../../js/helpers/toastify";
import {showStep} from "../../js/helpers/showStep";

export const formStepCode = () => {
    const step = document.querySelector("[data-step='code']");
    const form = step.querySelector("form");
    const errorElement = document.createElement("span");
    errorElement.classList.add("error");

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

            if (data) {
                toastSuccess(translate("success.cardActivated"));
                showStep("success");
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
import { translate } from "../../localization";
import { showStep } from "../helpers/showStep";

export const formStepCode = () => {
    const form = document.querySelector("[data-step='code'] form");
    const submitButton = form.querySelector(".send");
    const cancelButton = form.querySelector(".cancel");
    const errorElement = document.createElement("span");

    if (!form) {
        return;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const target = e.target;
        const otpCodeInput = target.querySelector("input[name='otpValue']");
        const otpCodeField = otpCodeInput.closest(".form__field");
        const otpCodeLabel = otpCodeField.querySelector(".form__field-label");

        if (otpCodeInput.value.length !== 6) {
            otpCodeField.classList.add("form__field--error");
            errorElement.textContent = translate("incorrectValue");
            otpCodeLabel.append(errorElement);
            return;
        }

        otpCodeField.classList.remove("form__field--error");
        errorElement.remove();

        // async logic
    };

    const handleCancel = (e) => {
        e.preventDefault();
        showStep("card");
    };

    cancelButton.addEventListener("click", handleCancel);
    form.addEventListener("submit", handleSubmit);
};
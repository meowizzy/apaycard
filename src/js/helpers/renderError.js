import { showStep } from "./showStep";

export const renderError = (msg) => {
    const errorStep = document.querySelector("[data-step='error']");
    const errorTitle = errorStep.querySelector(".form-container__title");

    if (errorTitle) {
        errorTitle.textContent = msg;
    }

    showStep("error");
};
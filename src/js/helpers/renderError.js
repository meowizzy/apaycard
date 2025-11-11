import {showStep} from "./showStep";

export const renderError = ({ title, subtitle, heading, titleSize = "md" }) => {
    const errorStep = document.querySelector("[data-step='error']");
    const errorInfo = errorStep.querySelector(".form-container__info");
    const errorHeading = errorInfo.querySelector(".form-container__info-heading");
    const errorTitle = errorInfo.querySelector(".form-container__info-title");
    const errorSubtitle = errorInfo.querySelector(".form-container__info-subtitle");

    if (errorHeading) {
        errorHeading.textContent = heading;
    }

    if (errorSubtitle) {
        errorHeading.textContent = subtitle;
    }

    if (errorTitle) {
        errorTitle.textContent = title;
        errorTitle.classList.add("form-container__info-title--" + titleSize);
    }

    showStep("error");
};
import { showStep } from "../../js/helpers/showStep";

export const renderLoadingStep = (message) => {
  const $message = document.querySelector(`[data-step="loading"] strong`);

  $message.textContent = message;
  showStep("loading");
};
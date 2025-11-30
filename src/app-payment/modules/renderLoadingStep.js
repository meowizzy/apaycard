import { showStepPayments } from "./showStep";

export const renderLoadingStep = (message) => {
  const $message = document.querySelector(`[data-step="loading"] strong`);

  $message.textContent = message;
  showStepPayments("loading");
};
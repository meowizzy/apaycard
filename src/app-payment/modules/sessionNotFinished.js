import { showStepPayments } from "./showStep";

export const sessionNotFinished = () => {
  const stepCode = sessionStorage.getItem("step");
  const countDown = sessionStorage.getItem("countDown");

  if (stepCode || countDown) {
    showStepPayments(stepCode, false, "SESSION_NOT_FINISHED");
  }
};

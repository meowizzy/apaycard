import { showRoot } from "./showRoot";
import { formStepCard } from "./formStepCard";
import { formStepCode } from "./formStepCode";
import { showStepPayments } from "./showStep";

const steps = {
  "card": formStepCard,
  "code": formStepCode,
};

export const sessionNotFinished = () => {
  const stepCode = sessionStorage.getItem("step");
  const countDown = sessionStorage.getItem("countDown");

  if (stepCode || countDown) {
    showRoot();
    showStepPayments(stepCode);
    steps[stepCode]();
  }
};
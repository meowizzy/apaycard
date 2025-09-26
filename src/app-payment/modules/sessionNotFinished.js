import { showStep } from "../../js/helpers/showStep";
import { showRoot } from "./showRoot";
import { formStepCard } from "./formStepCard";
import { formStepCode } from "./formStepCode";

export const sessionNotFinished = () => {
  const stepCode = sessionStorage.getItem("step");
  const countDown = sessionStorage.getItem("countDown");

  if (stepCode && countDown) {
    showRoot();
    showStep(stepCode);

    switch (stepCode) {
      case "card":
        formStepCard();
        break;
      case "code":
        formStepCode();
        break;
    }
  }
};
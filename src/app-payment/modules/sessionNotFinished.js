import {showStep} from "../../js/helpers/showStep";
import {showRoot} from "./showRoot";

export const sessionNotFinished = () => {
  const stepCode = sessionStorage.getItem("step");
  const countDown = sessionStorage.getItem("countDown");

  if (stepCode && countDown) {
    showRoot();
    showStep(stepCode);
  }
};
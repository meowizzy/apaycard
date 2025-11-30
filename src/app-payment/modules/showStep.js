import { showStep } from "../../js/helpers/showStep";
import {formStepCode} from "./formStepCode";
import {formStepCard} from "./formStepCard";

const steps = {
    card: formStepCard,
    code: formStepCode,
};

export const showStepPayments = (step, persist = false, ctx = "") => {
    const formHeaderStep = document.querySelector(`[data-step-code="${step}"]`);
    const formHeaderSteps = document.querySelectorAll(`[data-step-code]`);

    if (step && steps[step]) {
        steps[step](ctx);
    }

    if (formHeaderStep) {
        formHeaderSteps.forEach(step => step.classList.add("d-none"));
        formHeaderStep.classList.remove("d-none");
    }

    showStep(step, persist);
}
import { showStep } from "../../js/helpers/showStep";

export const showStepPayments = (step) => {
    const formHeaderStep = document.querySelector(`[data-step-code="${step}"]`);
    const formHeaderSteps = document.querySelectorAll(`[data-step-code]`);

    if (formHeaderStep) {
        formHeaderSteps.forEach(step => step.classList.add("d-none"));
        formHeaderStep.classList.remove("d-none");
    }

    showStep(step);
}
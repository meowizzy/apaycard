export const showStep = (stepCode, persist = false) => {
    const steps = document.querySelectorAll("[data-step]");
    const step = document.querySelector(`[data-step="${stepCode}"]`);
    const $form = document.querySelector(".form");

    $form.dataset.currentStep = stepCode;

    if (stepCode && persist) {
        sessionStorage.setItem("step", stepCode);
    }

    if (!step || !steps.length) {
        return;
    }

    steps.forEach((step) => {
        step.style.display = "none";
    })

    step.style.display = 'flex';
};
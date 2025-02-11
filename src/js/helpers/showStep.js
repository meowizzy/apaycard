export const showStep = (stepCode = "card") => {
    const steps = document.querySelectorAll("[data-step]");
    const step = document.querySelector(`[data-step="${stepCode}"]`);

    if (!step || !steps.length) {
        return;
    }

    steps.forEach((step) => {
        step.style.display = "none";
    })

    step.style.display = 'flex';
};
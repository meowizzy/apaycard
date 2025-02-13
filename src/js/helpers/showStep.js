export const showStep = (stepCode = sessionStorage.getItem("step") || "card") => {
    const steps = document.querySelectorAll("[data-step]");
    const step = document.querySelector(`[data-step="${stepCode}"]`);

    if (stepCode !== "error") {
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
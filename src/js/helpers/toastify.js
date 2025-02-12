import Toastify from "toastify-js";

const toastifyOptions = {
    close: true,
    duration: 4000,
    gravity: top,
    position: "right",
    stopOnFocus: true
};

export const toastError = (text) => {
    Toastify({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-danger)",
            boxShadow: "var(--color-danger)",
        }
    }).showToast();
};

export const toastSuccess = (text) => {
    Toastify({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-primary)",
            boxShadow: "var(--color-primary)",
        }
    }).showToast();
};

export const toastWarning = (text) => {
    Toastify({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-secondary)",
            boxShadow: "var(--color-secondary)",
        }
    }).showToast();
};

export const toastInfo = (text) => {
    Toastify({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-text)",
            boxShadow: "var(--color-text)",
        }
    }).showToast();
};
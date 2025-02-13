import ToastifyEs from "toastify-js/src/toastify-es";

const toastifyOptions = {
    close: true,
    duration: 4000,
    gravity: "top",
    position: "right",
    stopOnFocus: true,
    offset: {
        x: 15,
        y: 15
    }
};

export const toastError = (text) => {
    ToastifyEs({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-danger)",
            boxShadow: "var(--color-danger)",
        }
    }).showToast();
};

export const toastSuccess = (text) => {
    ToastifyEs({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-primary)",
            boxShadow: "var(--color-primary)",
        }
    }).showToast();
};

export const toastWarning = (text) => {
    ToastifyEs({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-secondary)",
            boxShadow: "var(--color-secondary)",
        }
    }).showToast();
};

export const toastInfo = (text) => {
    ToastifyEs({
        ...toastifyOptions,
        text,
        style: {
            background: "var(--color-text)",
            boxShadow: "var(--color-text)",
        }
    }).showToast();
};
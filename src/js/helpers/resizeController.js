import { debounce } from "../libs/debounce";

export const resizeController = (size, cb, cb1) => {
    if (!size && typeof cb !== "function" && typeof cb1 !== "function") return;

    window.innerWidth <= size ? cb() : cb1();

    const handleResize = debounce(function () {
        if (window.innerWidth <= size) {
            cb();
            console.log("window size debounce+++ ", size);
        } else {
            cb1();
        }
    }, 500);

    window.addEventListener("resize", handleResize);
};
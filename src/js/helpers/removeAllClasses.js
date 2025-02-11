export const removeAllClasses = (arr, activeClass) => {
    if (!arr.length) return;

    arr.forEach(el => {
        el.classList.remove(activeClass);
    });
};
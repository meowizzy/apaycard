import { languageSwitcher } from "./modules/languageSwitcher";
import { inputMaskInit } from "./modules/inputMaskInit";
import { appTypes } from "./appTypes";
import "toastify-js/src/toastify.css";

const initApp = () => {
    // FROM WEBPACK DEFINE PLUGIN
    appTypes[__APP_TYPE__]();
};

const onDocumentLoaded = () => {
    languageSwitcher();
    inputMaskInit();
    initApp();
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);


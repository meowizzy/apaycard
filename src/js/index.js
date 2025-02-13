import { languageSwitcher } from "./modules/languageSwitcher";
import { inputMaskInit } from "./modules/inputMaskInit";
import { formStepCode } from "./modules/formStepCode";
import { formStepCard } from "./modules/formStepCard";
import { checkId } from "./modules/checkId";
import "../localization/index";
import "toastify-js/src/toastify.css";
import {toastError} from "./helpers/toastify";

const onDocumentLoaded = () => {
    inputMaskInit();
    languageSwitcher();
    formStepCode();
    formStepCard();
    checkId();
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);


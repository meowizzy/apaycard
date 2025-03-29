import { formStepCode } from "./modules/formStepCode";
import { formStepCard } from "./modules/formStepCard";
import { checkId } from "./modules/checkId";

const onDocumentLoaded = () => {
    formStepCode();
    formStepCard();
    checkId();
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);
import { languageSwitcher } from "./modules/languageSwitcher";
import { inputMaskInit } from "./modules/inputMaskInit";
import "../localization/index";
import { showStep } from "./helpers/showStep";
import { otp } from "./modules/otp";
import {formStepCode} from "./modules/formStepCode";
import {formStepCard} from "./modules/formStepCard";
import {checkId} from "./modules/checkId";

const onDocumentLoaded = () => {
    inputMaskInit();
    languageSwitcher();
    otp();
    formStepCode();
    formStepCard();
    checkId();
};

document.addEventListener("DOMContentLoaded", onDocumentLoaded);


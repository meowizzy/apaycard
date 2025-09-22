import { formStepCode } from "./modules/formStepCode";
import { formStepCard } from "./modules/formStepCard";
import { checkId } from "./modules/checkId";

export const appCardAttachment = () => {
    formStepCode();
    formStepCard();
    checkId();
};
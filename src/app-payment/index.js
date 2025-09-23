import {checkTransId} from "./modules/checkTransId";
import {checkBillId} from "./modules/checkBillId";
import {catchMissingId} from "./modules/catchMissingId";
import {formStepCard} from "./modules/formStepCard";
import {formStepCode} from "./modules/formStepCode";

export const appPayment = () => {
  const caughtMissingId = catchMissingId();

  if (!caughtMissingId) return;

  checkTransId();
  checkBillId();
  formStepCard();
  formStepCode();
};
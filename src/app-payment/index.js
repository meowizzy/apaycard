import {checkTransId} from "./modules/checkTransId";
import {checkBillId} from "./modules/checkBillId";
import {catchMissingId} from "./modules/catchMissingId";
import {formStepCard} from "./modules/formStepCard";
import {formStepCode} from "./modules/formStepCode";
import {sessionNotFinished} from "./modules/sessionNotFinished";

export const appPayment = () => {
  const caughtMissingId = catchMissingId();

  if (!caughtMissingId) return;

  sessionNotFinished();
  checkTransId();
  checkBillId();
  formStepCard();
  formStepCode();
};
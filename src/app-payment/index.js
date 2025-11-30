import { checkTransId } from "./modules/checkTransId";
import { checkBillId } from "./modules/checkBillId";
import { catchMissingId } from "./modules/catchMissingId";
import { sessionNotFinished } from "./modules/sessionNotFinished";
import {showStepPayments} from "./modules/showStep";

export const appPayment = () => {
  const caughtMissingId = catchMissingId();

  if (!caughtMissingId) return;

  // sessionNotFinished();
  checkTransId();
  checkBillId();

  const completeButtons = document.querySelectorAll(".complete-button");

  if (completeButtons.length) {
    completeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        showStepPayments("card");
      });
    });
  }
};

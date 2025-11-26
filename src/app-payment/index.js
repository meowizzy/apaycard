import { checkTransId } from "./modules/checkTransId";
import { checkBillId } from "./modules/checkBillId";
import { catchMissingId } from "./modules/catchMissingId";
import { sessionNotFinished } from "./modules/sessionNotFinished";

export const appPayment = () => {
  const caughtMissingId = catchMissingId();

  if (!caughtMissingId) return;

  sessionNotFinished();
  checkTransId();
  checkBillId();
};

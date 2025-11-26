import { renderError } from "../../js/helpers/renderError";
import { translate } from "../../localization";
import { toastSuccess } from "../../js/helpers/toastify";
import { showStepPayments } from "./showStep";

export const renderFinishStep = (statusCode) => {
  switch (statusCode) {
    case "PAID":
      showStepPayments("success");
      toastSuccess(translate("success.paymentSuccess"));
      break;
    case "CANCELED":
      renderError({
        title: translate("errors.paymentError"),
      });
      break;
  }
};

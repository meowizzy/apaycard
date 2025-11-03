import { showStep } from "../../js/helpers/showStep";
import { renderError } from "../../js/helpers/renderError";
import { translate } from "../../localization";
import { toastSuccess } from "../../js/helpers/toastify";

export const renderFinishStep = (statusCode) => {
  switch (statusCode) {
    case "PAID":
      showStep("success");
      toastSuccess(translate("success.paymentSuccess"));
      break;
    case "CANCELED":
      renderError(translate("errors.paymentError"));
      break;
  }
};

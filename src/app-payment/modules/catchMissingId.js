import {SEARCH_PARAMS} from "../../js/app/constants";
import {renderError} from "../../js/helpers/renderError";
import {translate} from "../../localization";
import {showRoot} from "./showRoot";
import {toggleDetails} from "./showStatus";
import {showStep} from "../../js/helpers/showStep";

export const catchMissingId = () => {
  const billId = SEARCH_PARAMS.get("billId");
  const transId = SEARCH_PARAMS.get("trans_id");

  if ((!billId && !transId) || (billId && transId)) {
    renderError({
      title: translate("validateErrors.idNotEnteredOrIdIsIncorrect"),
      titleSize: "sm"
    });
    toggleDetails(false);
    showRoot();

    return false;
  }

  return true;
};
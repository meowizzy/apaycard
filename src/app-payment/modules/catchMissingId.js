import {SEARCH_PARAMS} from "../../js/app/constants";
import {renderError} from "../../js/helpers/renderError";
import {translate} from "../../localization";
import {showRoot} from "./showRoot";
import {toggleDetails} from "./showStatus";

export const catchMissingId = () => {
  const billId = SEARCH_PARAMS.get("billId");
  const transId = SEARCH_PARAMS.get("trans_id");

  if ((!billId && !transId) || (billId && transId)) {
    renderError(translate("validateErrors.idNotEnteredOrIdIsIncorrect"));
    toggleDetails(false);
    showRoot();

    return false;
  }

  return true;
};
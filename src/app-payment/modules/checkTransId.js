import { renderError } from "../../js/helpers/renderError";
import { translate } from "../../localization";
import { showStep } from "../../js/helpers/showStep";
import { $request } from "../../js/libs/request";
import { setDetails, toggleDetails } from "./showStatus";
import { showRoot } from "./showRoot";
import { renderFinishStep } from "./renderFinishStep";
import { SEARCH_PARAMS } from "../../js/app/constants";
import { toastError } from "../../js/helpers/toastify";
import {showStepPayments} from "./showStep";

export const checkTransId = () => {
  const transId = SEARCH_PARAMS.get("trans_id");
  const dataFromKapital = SEARCH_PARAMS.get("data");

  if (dataFromKapital) {
    const lastPathName = localStorage.getItem("lastPathName");

    if (lastPathName) {
      location.href = lastPathName + `?trans_id=${dataFromKapital}`;
    }
  }

  if (!transId) {
    // renderError(translate("errors.idIsNotEntered"));
    // showRoot();
    return;
  }

  const sendRequest = async () => {
    const startTime = Date.now();
    const timeout = 60000 * 10;

    try {
      const data = await $request({
        url: `/web/v1/bills/check/visa/${transId}`
      });

      if (data) {
        const currentTime = Date.now() - startTime;
        const statusCode = data?.status.code;

        if (currentTime < timeout) {
          if (statusCode === "PENDING") {
            setTimeout(() => {
              sendRequest();
            }, 5000);

            return;
          }
          showRoot();
          toggleDetails();
          setDetails(statusCode, translate(`statuses.${statusCode}`));
          localStorage.removeItem("lastPathName");

          renderFinishStep(statusCode);
        } else {
          showStepPayments("timeout");
        }
      }
    } catch (e) {
      renderError(e.message);
      toastError(e.message);
      toggleDetails(false);
      showRoot();
    } finally {
      toggleDetails(false);
    }
  };

  sendRequest();
};
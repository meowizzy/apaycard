import {renderError} from "../../js/helpers/renderError";
import {translate} from "../../localization";
import {showStep} from "../../js/helpers/showStep";
import {$request} from "../../js/libs/request";
import {setStatus, toggleDetails} from "./showStatus";
import {showRoot} from "./showRoot";

export const checkTransId = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const transId = queryParams.get("trans_id");
  const dataFromKapital = queryParams.get("data");

  if (dataFromKapital) {
    const lastPathName = localStorage.getItem("lastPathName");

    if (lastPathName) {
      location.href = lastPathName + `?trans_id=${dataFromKapital}`;
    }
  }

  if (!transId) {
    renderError(translate("errors.idIsNotEntered"));
    showRoot();
    return;
  }

  const sendRequest = async () => {
    const startTime = Date.now();
    const timeout = 60000 * 10;

    try {
      const data = await $request({
        url: `/web/v1/bills/card/check/visa/${transId}`
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
          setStatus(statusCode, translate(`statuses.${statusCode}`));
          localStorage.removeItem("lastPathName");

          switch (statusCode) {
            case "PAID":
              showStep("success");
              break;
            case "CANCELED":
              renderError("Платеж отменен");
              break;
          }
        } else {
          showStep("timeout");
        }
      }
    } catch (e) {
      renderError(e.message);
    } finally {
      toggleDetails(false);
    }
  };

  sendRequest();
};
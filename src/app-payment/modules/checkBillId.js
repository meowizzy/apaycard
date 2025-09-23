import {$request} from "../../js/libs/request";
import {setStatus, toggleDetails} from "./showStatus";
import {showRoot} from "./showRoot";
import {showStep} from "../../js/helpers/showStep";
import {renderLoadingStep} from "./renderLoadingStep";
import {translate} from "../../localization";
import {renderError} from "../../js/helpers/renderError";
import {renderFinishStep} from "./renderFinishStep";
import {toastError} from "../../js/helpers/toastify";
import {SEARCH_PARAMS} from "../../js/app/constants";

let firstReq = false;

export const checkBillId = async (ctx = "") => {
  const detailsTitle = document.querySelector(".form__header-top .form__title");
  const detailsPayment = document.querySelector(`[data-details-type="payment"] strong`);
  const detailsAmount = document.querySelector(`[data-details-type="amount"] strong`);
  const billId = SEARCH_PARAMS.get("billId");

  if (!billId) {
    // renderError("validateErrors.billIdNotEntered");
    // showRoot();
    return;
  }

  try {
    const data = await $request({
      url: `/web/v1/bills/check/${billId}`
    });

    if (data) {
      if (!firstReq) {
        detailsTitle.textContent = data.merchantName;
        detailsPayment.textContent = billId;
        detailsAmount.textContent = String(data.amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      }

      const statusCode = data.status.code === "CREATED" ? "PENDING" : data.status.code;

      setStatus(statusCode);
      toggleDetails();

      if (statusCode === "PENDING") {
        if (!ctx) {
          showStep("card");
        }

        if (ctx === "SMS_INPUT") {
          renderLoadingStep(translate("paymentProcessing"));
          setTimeout(() => {
            checkBillId(ctx);
          }, 4000);
        }
      } else {
        renderFinishStep(statusCode);
      }
    }

    firstReq = true;
  } catch (e) {
    toastError(e.message);
    renderError(e.message);
    toggleDetails(false);
  } finally {
    showRoot();
  }
};
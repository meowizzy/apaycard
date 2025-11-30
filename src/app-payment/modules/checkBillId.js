import { $request } from "../../js/libs/request";
import { setDetails, toggleDetails } from "./showStatus";
import { showRoot } from "./showRoot";
import { showStep } from "../../js/helpers/showStep";
import { translate } from "../../localization";
import { renderError } from "../../js/helpers/renderError";
import { renderFinishStep } from "./renderFinishStep";
import { toastError } from "../../js/helpers/toastify";
import { SEARCH_PARAMS } from "../../js/app/constants";
import { formStepCard } from "./formStepCard";
import { cvv } from "./cvv";
import { showStepPayments } from "./showStep";
import { sessionNotFinished as sessionNotFinishedFn } from "./sessionNotFinished";

let firstReq = false;

export const checkBillId = async (ctx = "", status = "") => {
  const step = sessionStorage.getItem("step");
  const countdown = sessionStorage.getItem("countDown");
  const sessionNotFinished = !!step && !!countdown;

  // if (sessionNotFinished) {
  //   return;
  // }

  const billId = SEARCH_PARAMS.get("billId");

  if (!billId) {
    // renderError(
    // "validateErrors.billIdNotEntered");
    // showRoot();

    return;
  }

  try {
    // const data = await $request({
    //   url: `/web/v1/bills/check/${billId}`,
    // });

    const data = await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          merchantName: "Oqtepa Lavash - Riviera",
          amount: 123000,
          status: {
            code: status || "CREATED",
          },
        });
      }, 2000);
    });

    if (data) {
      sessionNotFinishedFn();

      const detailsData = {
        title: data.merchantName,
        payment: billId,
        amount: `${String(data.amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
      };

      const statusCode =
        data.status.code === "CREATED" ? "PENDING" : data.status.code;

      setDetails({
        ...detailsData,
        status: {
          code: statusCode,
          message: translate(`statuses.${statusCode}`),
        },
      });

      if (statusCode === "PENDING") {
        if (!ctx && !sessionNotFinished) {
          showStepPayments("card");
          // cvv();
        }

        if (ctx === "SMS_INPUT") {
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
    renderError({
      title: e.message,
    });
    toggleDetails(false);
  } finally {
    showRoot();
  }
};

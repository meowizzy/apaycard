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
import {showStepPayments} from "./showStep";

let firstReq = false;

export const checkBillId = async (ctx = "") => {
  const step = sessionStorage.getItem("step");
  const countdown = sessionStorage.getItem("countDown");
  const sessionNotFinished = !!step && !!countdown;

  if (sessionNotFinished) {
    return;
  }

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

    const data = {
      merchantName: "Oqtepa Lavash - Riviera",
      amount: 123000,
      status: {
        code: "PENDING",
      },
    };

    if (data) {
      const detailsData = {
        title: data.merchantName,
        payment: billId,
        amount: `${String(data.amount).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}`,
      };

      if (!firstReq) {
        setDetails(detailsData);
      }

      const statusCode =
        data.status.code === "CREATED" ? "PENDING" : data.status.code;

      setDetails({
        status: {
          code: statusCode,
          message: translate(`statuses.${statusCode}`),
        },
      });
      toggleDetails();

      if (statusCode === "PENDING") {
        if (!ctx) {
          showStepPayments("card");
          formStepCard();
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
      title: e.message
    });
    toggleDetails(false);
  } finally {
    showRoot();
  }
};

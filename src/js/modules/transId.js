import { $request } from "../libs/request";
import { renderError } from "../helpers/renderError";
import { showStep } from "../helpers/showStep";

export const transId = () => {
  const startTime = Date.now();
  const timeout = 60 * 1000;
  const urlParams = new URLSearchParams(window.location.search);
  const transId = urlParams.get("trans_id");
  const transIdButton = document.querySelector('[data-step="timeout"] .lp-button');

  const checkTransId = () => {
    const sendRequest = async () => {
      try {
        const response = await $request({
          url: `/web/v1/bills/check/visa/${transId}`
        });
        const data = await response.json();

        if (response.ok) {
          resultFn(data);
        } else {
          throw new Error(data?.detail);
        }
      } catch(e) {
        catchFn(e.message);
      } finally {
        finallyFn();
      }
    };

    function resultFn(data) {
      const currentTime = Date.now() - startTime;
      const statusCode = data?.status.code;

      if (currentTime < timeout) {
        if (statusCode === "PENDING") {
          setTimeout(() => {
            sendRequest();
          }, 5000);

          return;
        }

        if (statusCode === "SUCCESS") {
          showStep("success");
        } else {
          renderError("error happened");
        }

        localStorage.removeItem("lastPathName");
      } else {
        showStep("timeout");
      }
    }

    function catchFn(errorMessage) {
      renderError(errorMessage);
    }

    function finallyFn() {
      transIdButton.classList.remove("loading");
    }

    sendRequest();
  };

  if (!transId) return;

  checkTransId();

  transIdButton.addEventListener("click", function() {
    this.classList.add("loading");
    checkTransId();
  });
};
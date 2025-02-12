import { showStep } from "../helpers/showStep";
import { BASE_URL } from "../app/constants";
import { translate } from "../../localization";
import { renderError } from "../helpers/renderError";

export const checkId = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    const pageLoader = document.querySelector(".page-loader");
    const rootContainer = document.querySelector(".wrapper .container");
    const formTitle = document.querySelector(".form__title");

    if (!id) {
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
        renderError(translate("errors.idIsNotEntered"));

        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/web/v1/bills/card/check/${id}`);

        if (response.status === 200) {
            const data = await response.json();

            const { merchantName, extId } = data;

            formTitle.textContent = merchantName;
            sessionStorage.setItem("extId", extId);

            showStep("card");
        } else if (response.status === 400 || response.status === 429 || response.status === 403) {
            throw new Error(translate("errors.incorrectId"));
        } else if (response.status >= 500) {
            throw new Error(translate("errors.serverSideError"));
        } else {
            throw new Error(translate("errors.errorHappened"));
        }
    } catch (e) {
        renderError(e.message);
    } finally {
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
    }
};
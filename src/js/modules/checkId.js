import { showStep } from "../helpers/showStep";
import { translate } from "../../localization";
import { renderError } from "../helpers/renderError";
import {$request} from "../libs/request";

export const checkId = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    const pageLoader = document.querySelector(".page-loader");
    const rootContainer = document.querySelector(".wrapper .container");
    const formTitle = document.querySelector(".form__title");
    const stepCode = sessionStorage.getItem("step");

    if (!id) {
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
        renderError(translate("errors.idIsNotEntered"));

        return;
    }

    if (sessionStorage.getItem("extId")) {
        showStep(stepCode || "card");
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
        return;
    }

    try {
        const response = await $request({
            url: `/web/v1/bills/card/check/${id}`
        });

        if (response.status === 200) {
            const data = await response.json();

            const { merchantName, extId } = data;

            formTitle.textContent = merchantName;
            sessionStorage.setItem("extId", extId);

            showStep("card");
        } else if (response.status === 400 || response.status === 403) {
            throw new Error(translate("errors.incorrectId"));
        }
    } catch (e) {
        renderError(e.message);
    } finally {
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
    }
};
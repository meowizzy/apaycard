import { renderError } from "../../js/helpers/renderError";
import { translate } from "../../localization";
import { showStep } from "../../js/helpers/showStep";
import { $request } from "../../js/libs/request";

export const checkId = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    const pageLoader = document.querySelector(".page-loader");
    const rootContainer = document.querySelector(".wrapper .container");
    const formTitle = document.querySelector(".form__title");
    const stepCode = sessionStorage.getItem("step");
    const extIdExpirationDate = 60000 * 10

    const setTitle = (text = sessionStorage.getItem("merchantName")) => {
        formTitle.textContent = text;
    };

    if (!id) {
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
        renderError({
            title: translate("errors.idIsNotEntered")
        });
        return;
    }

    if (sessionStorage.getItem("extId")) {
        showStep(stepCode || "card");
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");

        setTitle();
        return;
    }

    try {
        const data = await $request({
            url: `/web/v1/bills/card/check/${id}`
        });

        if (data) {
            const { merchantName, extId } = data;

            setTitle(merchantName);
            sessionStorage.setItem("extId", extId);
            sessionStorage.setItem("merchantName", merchantName);

            showStep("card");

            setTimeout(() => {
                sessionStorage.removeItem("extId");
            }, extIdExpirationDate);
        }
    } catch (e) {
        renderError({
            title: e.message
        });
    } finally {
        pageLoader.classList.add("d-none");
        rootContainer.classList.remove("d-none");
    }
};
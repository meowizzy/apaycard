import { translate } from "../../localization";
import {hideNumber} from "../../js/helpers/hideNumber";
import {normalizePhoneNumber} from "../../js/helpers/normalizePhoneNumber";

const codeStep = document.querySelector("[data-step='code']");
const codeStepFormDesc = codeStep.querySelector(".form__body-desc");

export const renderMerchantPhone = (phone = sessionStorage.getItem("phone")) => {
  const formattedPhone = phone ? normalizePhoneNumber(hideNumber({
    phone,
    sliceFromBack: 2,
    replaceTo: "*",
  })) : "";

  codeStepFormDesc.innerHTML = translate("smsConfirmationDescription", `<span style="color: var(--color-primary);">${formattedPhone}</span>`);
};
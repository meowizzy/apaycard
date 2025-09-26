import { translate } from "../../localization";

const codeStep = document.querySelector("[data-step='code']");
const codeStepFormDesc = codeStep.querySelector(".form__body-desc");

export const renderMerchantPhone = (phone = sessionStorage.getItem("phone")) => {
  codeStepFormDesc.textContent = translate("smsConfirmationDescription", phone);
};
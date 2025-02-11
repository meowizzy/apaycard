import {showStep} from "../helpers/showStep";
import {BASE_URL} from "../app/constants";

export const checkId = async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id");

    if (!id) {
        showStep("error");

        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/web/v1/bills/card/check/${id}`);
        const result = await response.json();
        console.log(result)
    } catch (e) {

    } finally {

    }
};
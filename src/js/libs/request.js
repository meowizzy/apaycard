import { BASE_URL } from "../app/constants";
import { translate } from "../../localization";

export const $request = async (props) => {
    const { url, ...restProps } = props;

    const response = await fetch(BASE_URL + url, restProps);

    if (response?.status === 429) {
        throw new Error(translate("errors.tooManyRequests"));
    } else if (response?.status >= 500) {
        throw new Error(translate("errors.serverSideError"));
    }

    return response;
};
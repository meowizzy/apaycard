import { BASE_URL, SITE_LANG } from "../app/constants";
import { translate } from "../../localization";

function throwError(status, message) {
    if (status >= 500) {
        throw new Error(translate("errors.serverSideError"));
    } else if (status === 429) {
        throw new Error(translate("errors.tooManyRequests"));
    } else {
        throw new Error(message);
    }
}

export const $request = async (props) => {
    const { url, headers, withoutResponse = false, ...restProps } = props;

    const response = await fetch(BASE_URL + url, {
        headers: {
            "lang": SITE_LANG,
            ...headers
        },
        ...restProps
    });

    const data = await response?.json();

    if (withoutResponse) {
        if (response.status === 200) {
            return true;
        }
    }

    if (response?.status === 200) {
        return data;
    }

    throwError(response?.status, data?.detail || data?.title);
};
import {redirectPaths} from "../../localization";

export const changeLang = (lang, changeLocation = true) => {
    const localeRegex = /\/[^\/]+\.html/;
    const url = new URL(location.href);

    if (localeRegex.test(url.href)) {
        url.href = url.href.replace(localeRegex, redirectPaths[lang]);
    } else {
        url.pathname = url.pathname.substring(0, url.pathname.length - 1) + redirectPaths[lang];
    }

    if (changeLocation) {
        location.href = url.toString();
    }

    return url.toString();
};
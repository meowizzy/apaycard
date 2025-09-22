import { SITE_LANG } from "../js/app/constants";
import localesByAppTypes from "./locales";
import template from "../index.hbs";

console.log("is dev: ", __IS_DEV__);
console.log("mode: ", __MODE__);
console.log("appType: ", __APP_TYPE__);

if (__IS_DEV__) {
    let templateData = template(Object.assign(localesByAppTypes[__APP_TYPE__][SITE_LANG], { APP_TYPE: __APP_TYPE__ }));

    document.body.innerHTML = new DOMParser().parseFromString(templateData, "text/html").body.outerHTML;
}

export const redirectPaths = {
    ru: "/",
    cuz: "/cuz.html",
    uz: "/uz.html"
};

export const translate = (ns, replacementText) => {
    if (typeof ns !== "string") return;

    const namespaces = ns.split(".");

    if (namespaces.length === 1) {
        const trans = localesByAppTypes[__APP_TYPE__][SITE_LANG][ns];

        if (replacementText) {
            return trans.replace("[code]", replacementText);
        }

        return trans;
    }

    const trans = namespaces.reduce((acc, cur) => {
        acc = acc[cur];

        return acc;
    }, localesByAppTypes[__APP_TYPE__][SITE_LANG]);

    if (replacementText) {
        return trans.replace("[code]", replacementText);
    }

    return trans;
};
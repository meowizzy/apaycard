import dataRu from "./ru.json";
import dataUz from "./uz.json";
import dataCuz from "./cuz.json";
import template from "../index.hbs";
import { SITE_LANG } from "../js/app/constants";

console.log("is dev: ", __IS_DEV__);
console.log("mode: ", __MODE__);

const locales = {
    ru: dataRu,
    uz: dataUz,
    cuz: dataCuz
};

if (__IS_DEV__) {
    let templateData = template(locales[SITE_LANG]);

    document.body.innerHTML = new DOMParser().parseFromString(templateData, "text/html").body.outerHTML;
}

export const redirectPaths = {
    ru: "/",
    cuz: "/cuz.html",
    uz: "/uz.html"
};

export const translate = (ns) => {
    if (typeof ns !== "string") return;

    const namespaces = ns.split(".");

    if (namespaces.length === 1) {
        return locales[SITE_LANG][ns];
    }

    return namespaces.reduce((acc, cur) => {
        acc = acc[cur];

        return acc;
    }, locales[SITE_LANG]);
};
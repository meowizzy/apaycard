import { LOCAL_STORAGE_LANG_KEY, SITE_LANG } from "../app/constants";
import { redirectPaths } from "../../localization";

export const languageSwitcher = () => {
    const queryParams = window.location.search;
    const langSwitcherOpener = document.querySelector(".languageSwitcher__head .languageSwitcher__item");
    const langSwitcherOpenerIcon = document.querySelector(".languageSwitcher__head .languageSwitcher__icon");
    const langSwitcherItems = document.querySelectorAll(".languageSwitcher__body .languageSwitcher__item");
    const localStorageLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY);
    const location = window.location;
    const pathname = location.pathname;
    const firstPath = pathname.split("/")[1];

    if (!langSwitcherOpener) return;

    if (localStorageLang) {
        if (SITE_LANG !== localStorageLang && !location.pathname.includes("textolite")) {
            location.href = "/" + firstPath + redirectPaths[localStorageLang] + (queryParams || "");
        }
    }

    langSwitcherItems.forEach((item) => {
       if (item.href) {
           item.href = location.origin + "/" + firstPath + item.href.replace(location.origin, "")  + (queryParams || "");
       }
    });

    const currFlagItem = Array.from(langSwitcherItems).find((item) => item.dataset.lang === SITE_LANG);

    currFlagItem.classList.add("languageSwitcher__item--active");

    langSwitcherOpenerIcon.outerHTML = currFlagItem.innerHTML;

    const handleOpenDropdown = (e) => {
        const target = e.target;
        const dropDown = target.parentElement.nextElementSibling;

        target.parentElement.classList.toggle("active");
        dropDown.classList.toggle("opened");
    };

    const handleClickSelectLanguage = (e) => {
        const target = e.target;

        if (target.closest(".languageSwitcher__body .languageSwitcher__item")) {
            const lang = target.dataset.lang;

            if (lang) {
                localStorage.setItem(LOCAL_STORAGE_LANG_KEY, lang);
            }
        }
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest(".languageSwitcher__head") &&
            !e.target.closest(".languageSwitcher__body")) {
            langSwitcherOpener.parentElement.classList.remove("active");
            langSwitcherItems[0].parentElement.classList.remove("opened");
        }
    };

    document.addEventListener("click", handleClickOutside);
    document.addEventListener("click", handleClickSelectLanguage);
    langSwitcherOpener.addEventListener("click", handleOpenDropdown);
};
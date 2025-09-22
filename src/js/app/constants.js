export const LOCAL_STORAGE_LANG_KEY = 'lang';
const queryParams = new URLSearchParams(window.location.search);
export const BASE_URL = (queryParams.get("isDev") || __IS_DEV__) ? "https://tmp-dev-api.a-pay.uz/api" : "https://api.a-pay.uz/api";
// export const BASE_URL = "https://dev-apay-api.a-pay.uz/api";
export const SITE_LANG = document.documentElement.lang;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import arJson from "../public/locales/ar.json"
import enJson from "../public/locales/en.json"


i18n.use(initReactI18next).init({
    debug: true,
    fallbackLng: "en",
    resources: {
    en: {translation:enJson},
    ar: {translation:arJson}
    },
    
});

export default i18n;
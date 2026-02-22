import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en";
import zh from "./locales/zh";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
    },
    fallbackLng: "en",
    // Only support 'zh' and 'en'; non-zh system languages fall back to 'en'
    supportedLngs: ["zh", "en"],
    detection: {
      // User's manual choice takes priority over system language
      order: ["localStorage", "navigator"],
      lookupLocalStorage: "i18n_lang",
      caches: ["localStorage"],
      // navigator.language returns 'zh-CN', 'zh-TW', etc. — strip the region part
      convertDetectedLanguage: (lng) => lng.split("-")[0],
    },
    interpolation: { escapeValue: false },
  });

export default i18next;

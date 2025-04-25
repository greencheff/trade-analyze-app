import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "tr",
  fallbackLng: "tr",
  resources: {
    tr: {
      translation: {
        welcome: "Hoş geldiniz",
        // Diğer çeviriler buraya
      },
    },
  },
});

export default i18n;

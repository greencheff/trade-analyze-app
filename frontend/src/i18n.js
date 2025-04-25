import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  lng: "tr", // Varsayılan dil
  fallbackLng: "tr",
  interpolation: {
    escapeValue: false, // React zaten XSS'e karşı güvenlidir
  },
  resources: {
    tr: {
      translation: {
        welcome: "Hoş geldiniz",
        features: "Özellikler",
        pricing: "Paketleri Gör",
        // Buraya bileşenlerde kullanmak istediğin çevirileri ekleyebilirsin
      },
    },
  },
});

export default i18n;

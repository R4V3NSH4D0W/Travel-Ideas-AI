import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./resources/en";
import bm from "./resources/bm";
import ja from "./resources/ja";

const resources = {
  en: { translation: en },
  bm: { translation: bm },
  ja: { translation: ja },
};

const initI18n = async () => {
  const defaultLanguage = (await AsyncStorage.getItem("language")) || "en";

  i18n.use(initReactI18next).init({
    resources,
    lng: defaultLanguage,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    debug: true,
  });
};

initI18n();

export default i18n;

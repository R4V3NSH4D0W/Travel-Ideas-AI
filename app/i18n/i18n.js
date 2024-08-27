import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import en from "./resources/en";
import ko from "./resources/ko";
import ru from "./resources/ru";
import ja from "./resources/ja";
import de from "./resources/de";

const resources = {
  en: { translation: en },
  ja: { translation: ja },
  ko: { translation: ko },
  ru: { translation: ru },
  de: { translation: de },
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

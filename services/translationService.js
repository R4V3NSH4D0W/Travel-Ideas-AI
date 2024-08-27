import axios from "axios";
import { GOOGLE_API_KEY } from "../env";

const TRANSLATION_API_KEY = GOOGLE_API_KEY;
const TRANSLATION_API_URL =
  "https://translation.googleapis.com/language/translate/v2";

export const translateText = async (
  text,
  targetLanguage,
  sourceLanguage = null
) => {
  try {
    const response = await axios.post(TRANSLATION_API_URL, null, {
      params: {
        q: text,
        target: targetLanguage,
        source: sourceLanguage,
        key: TRANSLATION_API_KEY,
      },
    });

    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};

export const appTranslateText = async (
  text,
  currentLanguage,
  sourceLanguage = "en"
) => {
  if (!text || !currentLanguage) {
    throw new Error("Text and target language are required for translation.");
  }
  try {
    const response = await axios.post(TRANSLATION_API_URL, null, {
      params: {
        q: text,
        target: currentLanguage,
        source: sourceLanguage,
        key: GOOGLE_API_KEY,
      },
    });

    if (
      response.data &&
      response.data.data &&
      response.data.data.translations
    ) {
      return response.data.data.translations[0].translatedText;
    } else {
      throw new Error("Unexpected response format from translation API.");
    }
  } catch (error) {
    console.error(
      "Translation error:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

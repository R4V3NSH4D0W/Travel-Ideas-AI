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

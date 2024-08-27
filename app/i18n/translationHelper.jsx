import i18n from "i18next";

export const TRANSLATE = (key, options = {}) => {
  return i18n.t(key, options);
};

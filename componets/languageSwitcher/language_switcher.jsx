import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  const switchLanguage = async (lang) => {
    try {
      await i18n.changeLanguage(lang);
      await AsyncStorage.setItem("language", lang);
      setCurrentLang(lang);
    } catch (error) {
      console.error(
        "Error changing language or saving to AsyncStorage:",
        error
      );
    }
  };

  useEffect(() => {
    setCurrentLang(i18n.language);
  }, [i18n.language]);

  return (
    <View style={styles.languageSwitcher}>
      <TouchableOpacity
        onPress={() => switchLanguage("en")}
        style={styles.languageButton}
      >
        <Text style={styles.languageText}>English</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => switchLanguage("ja")}
        style={styles.languageButton}
      >
        <Text style={styles.languageText}>日本語</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  languageSwitcher: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  languageButton: {
    padding: 10,
    margin: 5,
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 5,
  },
  languageText: {
    color: "#007bff",
    fontSize: 16,
  },
});

export default LanguageSwitcher;

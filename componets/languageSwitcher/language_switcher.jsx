import { useTranslation } from "react-i18next";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Image } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "@/constants/Colors";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentLang);
  const [items, setItems] = useState([
    {
      label: "English",
      value: "en",
      icon: () => (
        <Image
          source={require("../../assets/flags/en.png")}
          style={styles.flag}
        />
      ),
    },
    {
      label: "日本語",
      value: "ja",
      icon: () => (
        <Image
          source={require("../../assets/flags/ja.png")}
          style={styles.flag}
        />
      ),
    },
    {
      label: "Русский",
      value: "ru",
      icon: () => (
        <Image
          source={require("../../assets/flags/ru.jpg")}
          style={styles.flag}
        />
      ),
    },
    {
      label: "한국어",
      value: "ko",
      icon: () => (
        <Image
          source={require("../../assets/flags/ko.png")}
          style={styles.flag}
        />
      ),
    },
    {
      label: "Deutsch",
      value: "de",
      icon: () => (
        <Image
          source={require("../../assets/flags/germany-flag-48866.png")}
          style={styles.flag}
        />
      ),
    },
  ]);

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
    setValue(currentLang);
  }, [currentLang]);

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        style={styles.dropdown}
        placeholder="Select Language"
        onChangeValue={(value) => switchLanguage(value)}
        dropDownContainerStyle={styles.dropDownContainer}
        scrollViewProps={{
          showsVerticalScrollIndicator: false,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdown: {
    width: "65%",
    backgroundColor: "#ffffff",
    borderColor: Colors.EXTREME_LIGHT_GRAY,
  },
  dropDownContainer: {
    width: "65%",
    backgroundColor: "#ffffff",
    borderColor: Colors.EXTREME_LIGHT_GRAY,
  },
  flag: {
    width: 20,
    height: 15,
  },
});

export default LanguageSwitcher;

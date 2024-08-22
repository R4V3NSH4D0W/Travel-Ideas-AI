import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Clipboard,
  Alert,
  ToastAndroid,
} from "react-native";
import * as Speech from "expo-speech";
import DropDownPicker from "react-native-dropdown-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { Colors } from "../../constants/Colors";
import { translateText } from "../../services/translationService";
import { useRouter } from "expo-router";
import { languageOptions } from "../../constants/Options";

const TranslateScreen = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [fromLanguage, setFromLanguage] = useState("en");
  const [toLanguage, setToLanguage] = useState("es");
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [showTranslated, setShowTranslated] = useState(false);

  const router = useRouter();

  const handleTranslate = async () => {
    try {
      const result = await translateText(text, toLanguage, fromLanguage);
      setTranslatedText(result);
      setShowTranslated(true);
    } catch (error) {
      console.error("Translation failed:", error);
      Alert.alert("Error", "Translation failed. Please try again.");
    }
  };

  const swapLanguages = () => {
    setFromLanguage((prevFromLanguage) => {
      setToLanguage((prevToLanguage) => {
        return prevFromLanguage;
      });
      return toLanguage;
    });
  };

  const speakText = (textToSpeak) => {
    if (textToSpeak) {
      Speech.speak(textToSpeak);
    }
  };

  const copyToClipboard = (textToCopy) => {
    Clipboard.setString(textToCopy);
    ToastAndroid.show("Text copied to clipboard", ToastAndroid.SHORT);
  };

  const Header = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.icon}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Translate</Text>
    </View>
  );

  return (
    <View style={styles.mainContainer}>
      <Header />
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={openFrom}
          value={fromLanguage}
          items={languageOptions}
          setOpen={setOpenFrom}
          setValue={setFromLanguage}
          setItems={() => {}}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Translate From"
          containerStyle={{ width: "40%" }}
        />
        <TouchableOpacity onPress={swapLanguages} style={styles.arrowButton}>
          <FontAwesome6 name="arrow-right-arrow-left" size={18} color="black" />
        </TouchableOpacity>
        <DropDownPicker
          open={openTo}
          value={toLanguage}
          items={languageOptions}
          setOpen={setOpenTo}
          setValue={setToLanguage}
          setItems={() => {}}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownList}
          placeholder="Translate To"
          containerStyle={{ width: "40%" }}
        />
      </View>
      <Text style={styles.languageLabel}>
        {languageOptions.find((l) => l.value === fromLanguage)?.label ||
          "Source Language"}
      </Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="Enter text to translate"
        placeholderTextColor="#888"
        style={styles.textInput}
        multiline
      />
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => speakText(text)}
        >
          <AntDesign name="sound" size={18} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => copyToClipboard(text)}
        >
          <Feather name="copy" size={18} color="black" />
        </TouchableOpacity>
      </View>
      {showTranslated && (
        <>
          <Text style={styles.languageLabel}>
            {languageOptions.find((l) => l.value === toLanguage)?.label ||
              "Target Language"}
          </Text>
          <TextInput
            value={translatedText}
            placeholder="Translated text"
            placeholderTextColor="#888"
            style={styles.textInput}
            multiline
            editable={false}
          />
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => speakText(translatedText)}
            >
              <AntDesign name="sound" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => copyToClipboard(translatedText)}
            >
              <Feather name="copy" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </>
      )}

      <TouchableOpacity
        style={styles.translateButton}
        onPress={handleTranslate}
      >
        <Text style={styles.buttonText}>Translate</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    marginTop: 10,
    position: "relative",
  },
  icon: {
    position: "absolute",
    left: 0,
  },
  title: {
    fontSize: 24,
    fontFamily: "outfit-bold",
  },
  dropdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dropdown: {
    height: 40,
    backgroundColor: "#f9f9f9",
    borderRadius: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  dropdownList: {
    width: "100%",
  },
  arrowButton: {
    marginHorizontal: 10,
  },
  languageLabel: {
    marginTop: 20,
    paddingRight: 10,
    fontFamily: "outfit-bold",
  },
  textInput: {
    marginTop: 10,
    fontFamily: "outfit-regular",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height: 100,
  },
  actionContainer: {
    marginTop: 10,
    flexDirection: "row",
    gap: 10,
  },
  iconButton: {
    borderWidth: 1,
    height: 30,
    width: 30,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  translateButton: {
    backgroundColor: Colors.PRIMARY,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    marginTop: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: Colors.WHITE,
    fontFamily: "outfit-regular",
  },
});

export default TranslateScreen;

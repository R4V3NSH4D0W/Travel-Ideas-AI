import React from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import { TRANSLATE } from "../app/i18n/translationHelper";
import LanguageSwitcher from "./languageSwitcher/language_switcher";
import { useTranslation } from "react-i18next";
const { height, width } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const { i18n } = useTranslation();
  console.log("i18n", i18n.language);

  const images = {
    en: require("../assets/images/uk.jpg"),
    ru: require("../assets/images/russia.jpg"),
    ja: require("../assets/images/login.jpg"),
    ko: require("../assets/images/korea.jpg"),
    de: require("../assets/images/germany.jpg"),
  };

  const getImage = () => images[i18n.language] || images.en;

  return (
    <View>
      <Image style={{ width: width, height: 450 }} source={getImage()} />
      <View style={styles.container}>
        <Text
          style={{
            fontSize: 25,
            fontFamily: "outfit-bold",
            textAlign: "center",
            marginTop: 10,
          }}
        >
          {TRANSLATE("STARTING.AI_TRAVEL_PLANNER")}
        </Text>
        <Text
          style={{
            fontFamily: "outfit-regular",
            fontSize: 17,
            textAlign: "center",
            color: Colors.GRAY,
            marginTop: 20,
          }}
        >
          {TRANSLATE("STARTING.DISCOVER")}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("auth/sign-in")}
          style={styles.button}
        >
          <Text
            style={{
              color: Colors.WHITE,
              textAlign: "center",
              fontFamily: "outfit-regular",
              fontSize: 17,
            }}
          >
            {TRANSLATE("STARTING.GET_STARTED")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ zIndex: 1, position: "absolute", right: -85, top: 20 }}>
        <LanguageSwitcher />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.WHITE,
    marginTop: -20,
    height: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 25,
  },
  button: {
    padding: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 99,
    marginTop: "25%",
  },
});

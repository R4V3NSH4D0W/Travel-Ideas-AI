import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useTranslation } from "react-i18next";

import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import { TRANSLATE } from "../app/i18n/translationHelper";
import LanguageSwitcher from "./languageSwitcher/language_switcher";

const { height, width } = Dimensions.get("window");

export default function Login() {
  const router = useRouter();
  const { i18n } = useTranslation();

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
            marginTop: 10,
            textAlign: "center",
            fontFamily: "outfit-bold",
          }}
        >
          {TRANSLATE("STARTING.AI_TRAVEL_PLANNER")}
        </Text>
        <Text
          style={{
            fontSize: 17,
            marginTop: 20,
            color: Colors.GRAY,
            textAlign: "center",
            fontFamily: "outfit-regular",
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
              fontSize: 17,
              color: Colors.WHITE,
              textAlign: "center",
              fontFamily: "outfit-regular",
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
    padding: 25,
    marginTop: -20,
    height: "100%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.WHITE,
  },
  button: {
    padding: 15,
    borderRadius: 99,
    marginTop: "25%",
    backgroundColor: Colors.PRIMARY,
  },
});

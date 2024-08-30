import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";
import { FlatList } from "react-native-gesture-handler";
import { image } from "@tensorflow/tfjs";
import LanguageCard from "../../componets/langauge/language_card";

export default function ChangeLanguage() {
  const Languages = [
    {
      name: "English",
      code: "en",
      image: require("../../assets/images/uk.jpg"),
    },
    // {
    //   name: "Russian",
    //   code: "ru",
    //   image: require("../../assets/images/russia.jpg"),
    // },
    // {
    //   name: "Japanese",
    //   code: "ja",
    //   image: require("../../assets/images/login.jpg"),
    // },
    // {
    //   name: "Korean",
    //   code: "ko",
    //   image: require("../../assets/images/korea.jpg"),
    // },
    // {
    //   name: "German",
    //   code: "de",
    //   image: require("../../assets/images/germany.jpg"),
    // },
  ];
  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        height: "100%",
        backgroundColor: Colors.WHITE,
      }}
    >
      <FlatList
        data={Languages}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => <LanguageCard data={item} key={item.code} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({});

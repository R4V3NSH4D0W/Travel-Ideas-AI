import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "../../constants/Colors";
import { TRANSLATE } from "../../app/i18n/translationHelper";

const StartNewTripCard = () => {
  const router = useRouter();
  return (
    <View
      style={{
        gap: 25,
        padding: 20,
        marginTop: 50,
        display: "flex",
        alignItems: "center",
      }}
    >
      <Ionicons name="location-sharp" size={30} color="black" />
      <Text style={{ fontSize: 25, fontFamily: "outfit-medium" }}>
        {TRANSLATE("MISC.NO_TRIPS")}
      </Text>
      <Text
        style={{
          fontSize: 20,
          color: Colors.GRAY,
          textAlign: "center",
          fontFamily: "outfit-regular",
        }}
      >
        {TRANSLATE("MISC.NO_TRIPS_DESC")}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/create-trip/search-place")}
        style={{
          padding: 10,
          borderRadius: 15,
          paddingHorizontal: 30,
          backgroundColor: Colors.PRIMARY,
        }}
      >
        <Text
          style={{
            fontSize: 17,
            color: Colors.WHITE,
            fontFamily: "outfit-medium",
          }}
        >
          {TRANSLATE("MISC.START_NEW_TRIP")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartNewTripCard;

const styles = StyleSheet.create({});

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import { useRouter } from "expo-router";
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
        No trips planned yet
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit-regular",
          textAlign: "center",
          color: Colors.GRAY,
        }}
      >
        Looks like its time to plan a new travel experience! Get Started below
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
          Start a New Trip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StartNewTripCard;

const styles = StyleSheet.create({});

import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Stack } from "expo-router";
import { useFonts } from "expo-font";

import { CreateTripContext } from "../context/CreateTripContext";

export default function RootLayout() {
  useFonts({
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-medium": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-regular": require("../assets/fonts/Outfit-Regular.ttf"),
  });

  const [tripData, setTripData] = useState([]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CreateTripContext.Provider value={{ tripData, setTripData }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trip-details" />
        </Stack>
      </CreateTripContext.Provider>
    </GestureHandlerRootView>
  );
}

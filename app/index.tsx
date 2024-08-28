import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import "intl-pluralrules";
import { app, auth } from "../configs/FirebaseConfig";
import { initializeI18n } from "./i18n";
import Login from "@/componets/login";
import { AppState, AppStateStatus } from "react-native";

export default function Index() {
  const [appState, setAppState] = useState(AppState.currentState);
  const [isInitialized, setIsInitialized] = useState(false);
  const user = auth.currentUser;
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handelAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        setRefreshKey((prevKey) => prevKey + 1);
      }
      setAppState(nextAppState);
    };
    const subscription = AppState.addEventListener(
      "change",
      handelAppStateChange
    );
    return () => {
      subscription.remove();
    };
  }, [appState]);

  useEffect(() => {
    const initApp = async () => {
      await initializeI18n();
      setIsInitialized(true);
    };

    initApp();
  }, []);

  if (!isInitialized) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} key={refreshKey}>
      {user ? <Redirect href="/mytrip" /> : <Login />}
    </View>
  );
}

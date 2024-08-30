import "intl-pluralrules";
import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

import { Redirect } from "expo-router";
import Login from "@/componets/login";
import { initializeI18n } from "./i18n";
import { auth } from "../configs/FirebaseConfig";

export default function Index() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);

  const user = auth.currentUser;

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

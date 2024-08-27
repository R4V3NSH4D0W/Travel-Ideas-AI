import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Redirect } from "expo-router";
import { auth } from "../configs/FirebaseConfig";
import { initializeI18n } from "./i18n";
import Login from "@/componets/login";

export default function Index() {
  const [isInitialized, setIsInitialized] = useState(false);
  const user = auth.currentUser;

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
    <View style={{ flex: 1 }}>
      {user ? <Redirect href="/mytrip" /> : <Login />}
    </View>
  );
}

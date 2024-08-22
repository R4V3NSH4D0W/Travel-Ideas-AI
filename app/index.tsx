import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Redirect, useRouter } from "expo-router";

import { auth } from "../configs/FirebaseConfig";

import Login from "@/componets/login";

export default function Index() {
  const user = auth.currentUser;

  return (
    <View style={{ flex: 1 }}>
      {user ? <Redirect href={"/mytrip"} /> : <Login />}
    </View>
  );
}

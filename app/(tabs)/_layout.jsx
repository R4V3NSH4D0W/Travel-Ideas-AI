import React from "react";
import { StyleSheet } from "react-native";

import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "../../constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarActiveBackgroundColor: Colors.WHITE,
        tabBarStyle: {
          height: 60,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="location-sharp" size={26} color={color} />
          ),
        }}
        name="mytrip"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="globe-sharp" size={26} color={color} />
          ),
        }}
        name="discover"
      />
      <Tabs.Screen
        options={{
          tabBarLabel: " ",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={26} color={color} />
          ),
        }}
        name="profile"
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({});

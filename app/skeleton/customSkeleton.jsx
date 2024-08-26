import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function CustomSkeletonPlaceholder({ style }) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={["#e1e9ee", "#f2f8fc", "#e1e9ee"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e1e9ee",
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

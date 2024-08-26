import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

import CustomSkeletonPlaceholder from "./customSkeleton";

const { width } = Dimensions.get("window");

export default function WeatherSkeleton() {
  return (
    <View style={styles.container}>
      <CustomSkeletonPlaceholder style={styles.Date} />
      <CustomSkeletonPlaceholder style={styles.weather} />
      <CustomSkeletonPlaceholder style={styles.temp} />
      <CustomSkeletonPlaceholder style={styles.detail} />
      <CustomSkeletonPlaceholder style={styles.shortDetail} />
    </View>
  );
}

const baseStyle = {
  height: 20,
  borderRadius: 8,
  marginTop: 8,
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  Date: {
    ...baseStyle,
    width: width / 2,
    marginTop: 10,
  },
  weather: {
    ...baseStyle,
    width: width / 4,
    marginTop: 10,
  },
  temp: {
    ...baseStyle,
    width: width - 60,
  },
  detail: {
    ...baseStyle,
    width: width - 80,
  },
  shortDetail: {
    ...baseStyle,
    width: 80,
  },
});

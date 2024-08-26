import React from "react";
import { View, StyleSheet } from "react-native";
import CustomSkeletonPlaceholder from "./customSkeleton";

export default function HotelSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.container}>
        <CustomSkeletonPlaceholder style={styles.imagePlaceholder} />
        <CustomSkeletonPlaceholder style={styles.namePlaceholder} />
        <View style={styles.row}>
          <CustomSkeletonPlaceholder style={styles.rating} />
          <CustomSkeletonPlaceholder style={styles.price} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeletonContainer: {
    paddingTop: 20,
  },
  imagePlaceholder: {
    width: 250,
    height: 120,
    borderRadius: 8,
  },
  container: {
    paddingRight: 20,
  },
  namePlaceholder: {
    width: 80,
    height: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  rating: {
    width: 40,
    height: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  price: {
    width: 100,
    height: 20,
    marginTop: 10,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

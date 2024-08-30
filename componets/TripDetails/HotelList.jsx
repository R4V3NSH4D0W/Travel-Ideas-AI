import React from "react";
import { View, Text, FlatList } from "react-native";

import HotelCard from "./HotelCard";
import { TRANSLATE } from "../../app/i18n/translationHelper";

export default function HotelList({ hotelList }) {
  return (
    <View
      style={{
        marginTop: 20,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontFamily: "outfit-bold",
        }}
      >
        {TRANSLATE("MISC.HOTEL_RECOMMENDATION")}
      </Text>
      <FlatList
        data={hotelList}
        style={{
          marginTop: 8,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => <HotelCard item={item} />}
      />
    </View>
  );
}

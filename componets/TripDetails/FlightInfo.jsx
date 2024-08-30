import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

import { Colors } from "../../constants/Colors";

export default function FlightInfo({ flightData }) {
  return (
    <View
      style={{
        padding: 10,
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.LIGHT_GRAY,
        // backgroundColor: Colors.LIGHT_GRAY,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "outfit-bold",
          }}
        >
          ✈️ Flights
        </Text>
        <TouchableOpacity
          style={{
            padding: 5,
            width: 100,
            marginTop: 7,
            borderRadius: 7,
            backgroundColor: Colors.PRIMARY,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: Colors.WHITE,
              fontFamily: "outfit-regular",
            }}
          >
            Book Here
          </Text>
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 17,
          marginTop: 7,
          fontFamily: "outfit-regular",
        }}
      >
        {flightData?.airlineName || flightData?.airline}
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontFamily: "outfit-regular",
        }}
      >
        Price: {flightData?.amount || flightData?.price}
      </Text>
    </View>
  );
}

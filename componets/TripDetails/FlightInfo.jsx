import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

export default function FlightInfo({ flightData }) {
  console.log("here", flightData);
  //   const flight = flightData && flightData.length > 0 ? flightData[0] : null;
  return (
    <View
      style={{
        marginTop: 20,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: Colors.LIGHT_GRAY,
        // backgroundColor: Colors.LIGHT_GRAY,
        padding: 10,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          ✈️ Flights
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: Colors.PRIMARY,
            padding: 5,
            width: 100,
            marginTop: 7,
            borderRadius: 7,
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
          fontFamily: "outfit-regular",
          fontSize: 17,
          marginTop: 7,
        }}
      >
        {flightData?.airlineName || flightData?.airline}
      </Text>
      <Text
        style={{
          fontFamily: "outfit-regular",
          fontSize: 17,
        }}
      >
        Price: {flightData?.amount || flightData?.price}
      </Text>
    </View>
  );
}

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Colors } from "../../constants/Colors";

const OptionCard = ({ option, selectedOption }) => {
  return (
    <View
      style={[
        {
          padding: 25,
          display: "flex",
          borderRadius: 15,
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: Colors.EXTREME_LIGHT_GRAY,
        },
        selectedOption?.id == option?.id && { borderWidth: 3 },
      ]}
    >
      <View>
        <Text
          style={{
            fontSize: 20,
            fontFamily: "outfit-bold",
          }}
        >
          {option?.title}
        </Text>
        <Text
          style={{
            fontSize: 17,
            color: Colors.GRAY,
            fontFamily: "outfit-regular",
          }}
        >
          {option?.desc}
        </Text>
      </View>
      <Text style={{ fontSize: 40 }}>{option?.icon}</Text>
    </View>
  );
};

export default OptionCard;

const styles = StyleSheet.create({});

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { SelectTravelerList } from "../../constants/Options";
import OptionCard from "../../componets/CreateTrip/OptionCard";
import { CreateTripContext } from "../../context/CreateTripContext";
export default function SelectTraveler() {
  const navigation = useNavigation();
  const [selectedTraveler, setSelectedTraveler] = useState();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();
  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerShown: true,
      headerTransparent: true,
    });
  }, []);

  useEffect(() => {
    setTripData({
      ...tripData,
      traveler: selectedTraveler,
    });
  }, [selectedTraveler]);

  const onContinuePress = () => {
    if (!selectedTraveler) {
      ToastAndroid.show("Please select a traveler", ToastAndroid.LONG);
      return;
    }

    router.push("/create-trip/select-dates");
  };

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        height: "100%",
        backgroundColor: Colors.WHITE,
      }}
    >
      <Text style={{ fontSize: 30, fontFamily: "outfit-bold", marginTop: 20 }}>
        Who's Travelling
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontFamily: "outfit-bold", fontSize: 23 }}>
          Choose your travelers
        </Text>
        <FlatList
          data={SelectTravelerList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedTraveler(item);
              }}
              style={{ marginVertical: 10 }}
            >
              <OptionCard option={item} selectedOption={selectedTraveler} />
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        onPress={onContinuePress}
        style={{
          padding: 15,
          marginTop: 20,
          borderRadius: 15,
          backgroundColor: Colors.PRIMARY,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: Colors.WHITE,
            fontFamily: "outfit-medium",
            fontSize: 20,
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

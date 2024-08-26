import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { CreateTripContext } from "../../context/CreateTripContext";
import { GOOGLE_API_KEY } from "../../env";

const SearchPlace = () => {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);

  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Search Place",
      headerTransparent: true,
    });
  }, []);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        height: "100%",
        backgroundColor: Colors.WHITE,
      }}
    >
      <GooglePlacesAutocomplete
        placeholder="Search Place"
        fetchDetails={true}
        onPress={(data, details = null) => {
          setTripData({
            locationInfo: {
              name: data.description,
              coordinate: details?.geometry.location,
              photoRef: details?.photos[0].photo_reference,
              url: details?.url,
            },
          });
          router.push("/create-trip/selectTraveler");
        }}
        query={{
          key: GOOGLE_API_KEY,
          language: "en",
        }}
        styles={{
          textInputContainer: {
            borderWidth: 1,
            borderRadius: 5,
            marginTop: 50,
          },
        }}
      />
    </View>
  );
};

export default SearchPlace;

const styles = StyleSheet.create({});

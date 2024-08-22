import { View, Text, Image, Linking, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { UAT_GOOGLE_KEY } from "../../env";
import { GetPhotoRef } from "../../services/GooglePlaceApi";

export default function HotelCard({ item }) {
  console.log("item", item?.websiteURL);
  const sliceHotelText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };
  const [photoRef, setPhotoRef] = useState();

  useEffect(() => {
    GetGooglePhotoRef();
  }, [item?.name]);

  const GetGooglePhotoRef = async () => {
    try {
      const photoRef = await GetPhotoRef(item?.name);
      setPhotoRef(photoRef.results[0]?.photos[0]?.photo_reference);
    } catch (error) {
      console.error("Failed to fetch photo reference:", error);
    }
  };

  const handlePress = () => {
    if (item?.websiteURL) {
      Linking.openURL(item?.websiteURL).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        marginRight: 20,
        width: 250,
        // borderWidth: 1,
      }}
    >
      <Image
        source={{
          uri:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
            photoRef +
            "&key=" +
            UAT_GOOGLE_KEY,
        }}
        style={{
          width: 250,
          height: 120,
          borderRadius: 15,
        }}
      />
      {/* <Image
        style={{
          width: 210,
          height: 120,
          borderRadius: 15,
        }}
        source={require("../../assets/images/login.jpg")}
      /> */}
      <View
        style={{
          padding: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-medium",
            fontSize: 17,
          }}
        >
          {sliceHotelText(item?.name, 17)}
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text
            style={{
              fontFamily: "outfit-regular",
            }}
          >
            ⭐ {item?.rating}
          </Text>
          <Text
            style={{
              fontFamily: "outfit-regular",
            }}
          >
            💰 {item?.price}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

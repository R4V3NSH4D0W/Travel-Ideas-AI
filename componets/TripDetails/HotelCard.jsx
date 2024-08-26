import { View, Text, Image, Linking, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { GOOGLE_API_KEY } from "../../env";
import { GetPhotoRef } from "../../services/GooglePlaceApi";
import HotelSkeleton from "../../app/skeleton/hotel_skeleton";

export default function HotelCard({ item }) {
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    try {
      const photoRef = await GetPhotoRef(item?.name);
      setPhotoRef(photoRef.results[0]?.photos[0]?.photo_reference);
    } catch (error) {
      console.error("Failed to fetch photo reference:", error);
    }
    setLoading(false);
  };

  const handlePress = () => {
    if (item?.websiteURL) {
      Linking.openURL(item?.websiteURL).catch((err) =>
        console.error("Failed to open URL:", err)
      );
    }
  };
  if (loading) {
    return <HotelSkeleton />;
  }
  return (
    <TouchableOpacity
      onPress={handlePress}
      style={{
        marginRight: 20,
        width: 250,
      }}
    >
      <Image
        source={{
          uri:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
            photoRef +
            "&key=" +
            GOOGLE_API_KEY,
        }}
        style={{
          width: 250,
          height: 120,
          borderRadius: 15,
        }}
      />

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

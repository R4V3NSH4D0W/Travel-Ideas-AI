import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Share,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import moment from "moment";
import { Colors } from "../../constants/Colors";
import { GOOGLE_API_KEY } from "../../env";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TRANSLATE } from "../../app/i18n/translationHelper";
import i18next from "i18next";
import { appTranslateText } from "../../services/translationService";

export default function UserTripCard({ trip, id, onDelete }) {
  const router = useRouter();
  const currentLanguage = i18next.language;
  const [translatedActivity, setTranslatedActivity] = useState(null);
  console.log("translatedActivity", translatedActivity);

  const formatData = (data) => JSON.parse(data);

  const generateLink = () => {
    const encodedTrip = encodeURIComponent(JSON.stringify(trip));
    const link = `http://192.168.254.253:8081/trip-details?data=${encodedTrip}`;

    return link;
  };

  const handleShare = async () => {
    try {
      const link = generateLink();
      const result = await Share.share({
        message: `Check out my trip details: ${link}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Shared with activity type: ${result.activityType}`);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    const translateActivityDetails = async () => {
      try {
        if (currentLanguage !== "en" && trip) {
          const translatedPlaceName = await appTranslateText(
            trip?.location,
            currentLanguage
          );

          setTranslatedActivity({
            name: translatedPlaceName,
          });
        } else {
          setTranslatedActivity({
            name: trip?.location,
          });
        }
      } catch (error) {
        console.error("Translation failed:", error);
        setTranslatedActivity({
          name: trip?.location,
        });
      }
    };

    translateActivityDetails();
  }, [trip, currentLanguage]);

  const renderRightActions = (progress, dragX) => (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        display: "flex",
        flexDirection: "row",
        gap: 20,
      }}
    >
      <TouchableOpacity onPress={handleShare}>
        <Ionicons name="share-social-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(id)}>
        <Ionicons name="trash" size={30} color="red" />
      </TouchableOpacity>
    </View>
  );

  const tripData = formatData(trip.tripData);
  const traveler = tripData?.traveler;
  const travelerTitleKey = traveler ? `TRAVELER.${traveler.id}_TITLE` : "N/A";

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity
        onPress={() =>
          router.push({
            pathname: "/trip-details",
            params: {
              trip: JSON.stringify(trip),
            },
          })
        }
        style={{
          marginTop: 20,
          display: "flex",
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
              tripData?.locationInfo?.photoRef +
              "&key=" +
              GOOGLE_API_KEY,
          }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 15,
          }}
        />
        <View>
          <Text style={{ fontFamily: "outfit-medium", fontSize: 18 }}>
            {translatedActivity?.name}
          </Text>
          <Text
            style={{
              fontFamily: "outfit-regular",
              fontSize: 14,
              color: Colors.GRAY,
            }}
          >
            {moment(tripData?.startDate).format("DD MMM yyyy")}
          </Text>
          <Text
            style={{
              fontFamily: "outfit-regular",
              fontSize: 14,
              color: Colors.GRAY,
            }}
          >
            {TRANSLATE("MISC.TRAVELLING")}: {TRANSLATE(travelerTitleKey)}
          </Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
}

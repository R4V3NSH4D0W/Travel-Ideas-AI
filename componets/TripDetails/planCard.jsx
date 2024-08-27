import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import { GetPhotoRef } from "../../services/GooglePlaceApi";
import { GOOGLE_API_KEY } from "../../env";
import { TRANSLATE } from "../../app/i18n/translationHelper";
import i18next from "i18next";

import { appTranslateText } from "../../services/translationService";
const PlanCard = ({ activity, location }) => {
  const [photoRef, setPhotoRef] = useState();
  const [translatedActivity, setTranslatedActivity] = useState({});
  const currentLanguage = i18next.language;

  useEffect(() => {
    const fetchData = async () => {
      try {
        await GetGooglePhotoRef();
        if (currentLanguage !== "en") {
          await translateActivityDetails();
        } else {
          setTranslatedActivity(activity);
        }
      } catch (error) {
        setTranslatedActivity(activity);
      } finally {
        setLoading(false);
      }
    };
    // HOLD TO PREVENT UNNECESSAY CALLS !activity
    if (!activity) {
      fetchData();
    }
  }, [activity, currentLanguage]);

  const GetGooglePhotoRef = async () => {
    try {
      const photoRef = await GetPhotoRef(activity?.placeName);
      setPhotoRef(photoRef.results[0]?.photos[0]?.photo_reference);
    } catch (error) {
      console.error("Failed to fetch photo reference:", error);
    }
  };

  const translateActivityDetails = async () => {
    try {
      const translatedPlaceName = await appTranslateText(
        activity?.placeName,
        currentLanguage
      );
      const translatedPlaceDetails = await appTranslateText(
        activity?.placeDetails,
        currentLanguage
      );
      const translatedTicketPricing = await appTranslateText(
        activity?.ticketPricing,
        currentLanguage
      );
      const translatedTimeToTravel = await appTranslateText(
        activity?.timeToTravelBetweenPlaces || "N/A",
        currentLanguage
      );

      setTranslatedActivity({
        placeName: translatedPlaceName,
        placeDetails: translatedPlaceDetails,
        ticketPricing: translatedTicketPricing,
        timeToTravelBetweenPlaces: translatedTimeToTravel,
      });
    } catch (error) {
      setTranslatedActivity(activity);
    }
  };

  const handleNavigate = () => {
    if (translatedActivity?.placeName) {
      const placeName = encodeURIComponent(translatedActivity.placeName);
      const query = `${placeName},${location}`;

      const googleMapsUrl = `google.navigation:q=${query}`;
      const appleMapsUrl = `maps://?q=${query}`;
      const webUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;

      Linking.canOpenURL(googleMapsUrl)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(googleMapsUrl);
          } else {
            return Linking.canOpenURL(appleMapsUrl);
          }
        })
        .then((supported) => {
          if (supported) {
            return Linking.openURL(appleMapsUrl);
          } else {
            return Linking.openURL(webUrl);
          }
        })
        .catch((err) => console.error("Failed to open URL:", err));
    }
  };

  return (
    <View style={styles.card}>
      <Image
        source={{
          uri:
            "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
            photoRef +
            "&key=" +
            GOOGLE_API_KEY,
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.placeName}>{translatedActivity.placeName}</Text>
      <Text style={styles.placeDetails}>{translatedActivity.placeDetails}</Text>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.infoText}>
            🎟️ {TRANSLATE("MISC.TICKET_PRICE")}:{" "}
            <Text style={styles.boldText}>
              {translatedActivity.ticketPricing}
            </Text>
          </Text>
          <Text style={styles.infoText}>
            🕑 {TRANSLATE("MISC.TIME_TO_TRAVEL")}:{" "}
            <Text style={styles.boldText}>
              {translatedActivity.timeToTravelBetweenPlaces}
            </Text>
          </Text>
        </View>
        <TouchableOpacity onPress={handleNavigate} style={styles.iconContainer}>
          <Ionicons name="navigate" size={24} color={Colors.WHITE} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    backgroundColor: Colors.EXTREME_LIGHT_GRAY,
    borderRadius: 15,
    padding: 8,
  },
  image: {
    width: "100%",
    height: 150,
    marginBottom: 10,
    borderRadius: 15,
  },
  placeName: {
    fontSize: 16,
    fontFamily: "outfit-bold",
  },
  placeDetails: {
    fontSize: 16,
    fontFamily: "outfit-regular",
  },
  infoContainer: {
    marginTop: 4,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  infoText: {
    fontFamily: "outfit-regular",
    maxWidth: 290,
  },
  boldText: {
    fontFamily: "outfit-bold",
  },
  iconContainer: {
    backgroundColor: Colors.PRIMARY,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PlanCard;

import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import moment from "moment";
import i18next from "i18next";
import { useRouter } from "expo-router";

import UserTripCard from "./userTripCard";
import { GOOGLE_API_KEY } from "../../env";
import { Colors } from "../../constants/Colors";
import { TRANSLATE } from "../../app/i18n/translationHelper";
import { appTranslateText } from "../../services/translationService";

export default function UserTripList({ userTrips, setUserTrips, onDelete }) {
  const router = useRouter();

  const currentLanguage = i18next.language;
  const [translatedActivity, setTranslatedActivity] = useState(null);

  useEffect(() => {
    const translateActivityDetails = async () => {
      try {
        if (currentLanguage !== "en" && userTrips) {
          const translatedPlaceName = await appTranslateText(
            LatestTrip?.locationInfo?.name,
            currentLanguage
          );

          setTranslatedActivity({
            name: translatedPlaceName,
          });
        } else {
          setTranslatedActivity({
            name: LatestTrip?.locationInfo?.name,
          });
        }
      } catch (error) {
        console.error("Translation failed:", error);
        setTranslatedActivity({
          name: LatestTrip?.locationInfo?.name,
        });
      }
    };

    translateActivityDetails();
  }, [userTrips, currentLanguage]);

  const LatestTrip =
    userTrips.length > 0
      ? JSON.parse(userTrips[userTrips.length - 1].tripData)
      : {};

  return (
    <View>
      <View style={{ marginTop: 20 }}>
        {LatestTrip?.locationInfo?.photoRef ? (
          <Image
            source={{
              uri:
                "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
                LatestTrip.locationInfo.photoRef +
                "&key=" +
                GOOGLE_API_KEY,
            }}
            style={{
              height: 240,
              width: "100%",
              borderRadius: 15,
              objectFit: "cover",
            }}
          />
        ) : (
          <Image
            source={require("../../assets/images/login.jpg")}
            style={{
              height: 240,
              width: "100%",
              borderRadius: 15,
              objectFit: "cover",
            }}
          />
        )}

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>
            {translatedActivity?.name}
          </Text>
          <View
            style={{
              marginTop: 5,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text
              style={{
                fontSize: 17,
                color: Colors.GRAY,
                fontFamily: "outfit-regular",
              }}
            >
              {LatestTrip.startDate
                ? moment(LatestTrip.startDate).format("DD MMM yyyy")
                : "Date"}
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: Colors.GRAY,
                fontFamily: "outfit-regular",
              }}
            >
              🚋
              {TRANSLATE(`MISC.${LatestTrip?.traveler?.title.toUpperCase()}`)}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "/trip-details",
                params: {
                  trip: JSON.stringify(userTrips[userTrips.length - 1]),
                },
              })
            }
            style={{
              padding: 15,
              marginTop: 10,
              borderRadius: 15,
              backgroundColor: Colors.PRIMARY,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: Colors.WHITE,
                textAlign: "center",
                fontFamily: "outfit-medium",
              }}
            >
              {TRANSLATE("MISC.SEE_YOUR_PLAN")}
            </Text>
          </TouchableOpacity>
        </View>
        {userTrips.map((trip, index) => (
          <UserTripCard
            trip={trip}
            id={trip.uniqueID}
            key={index}
            onDelete={onDelete}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});

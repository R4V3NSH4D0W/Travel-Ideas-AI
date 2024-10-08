import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { GOOGLE_API_KEY } from "../../env";
import moment from "moment";
import FlightInfo from "../../componets/TripDetails/FlightInfo";
import * as Linking from "expo-linking";
import HotelList from "../../componets/TripDetails/HotelList";
import PlannedTrip from "../../componets/TripDetails/PlannedTrip";
import HotelSkeleton from "../skeleton/hotel_skeleton";
import WeatherSkeleton from "../skeleton/weather_Skeleton";
import { appTranslateText } from "../../services/translationService";
import i18next from "i18next";
import { TRANSLATE } from "../i18n/translationHelper";

const TripDetails = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const currentLanguage = i18next.language;

  const { trip } = useLocalSearchParams();

  const [tripDetails, setTripDetails] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  const [translatedActivity, setTranslatedActivity] = useState(null);

  useEffect(() => {
    if (tripDetails) {
      const data = formatData(tripDetails?.tripData);
      const endDate = new Date(data?.endDate);
      const currentDate = new Date();
      setIsEnded(endDate < currentDate);
    }
  }, [tripDetails]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerTransparent: true,
    });

    if (typeof trip === "string") {
      const parsedTrip = formatData(trip);
      setTripDetails(parsedTrip);
    } else {
      console.error("Trip parameter is not a string:", trip);
    }
  }, [trip]);

  useEffect(() => {
    const handleDeepLink = (event) => {
      const data = Linking.parse(event.url);
      if (data.path === "trip-details" && data.queryParams.data) {
        const trip = JSON.parse(decodeURIComponent(data.queryParams.data));
        setTripDetails(trip);
      }
    };

    const handleInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      if (initialURL) {
        handleDeepLink({ url: initialURL });
      }
    };

    handleInitialURL();
    const subscription = Linking.addEventListener("url", handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, [router]);

  useEffect(() => {
    const translateActivityDetails = async () => {
      try {
        if (currentLanguage !== "en" && tripDetails) {
          const translatedPlaceName = await appTranslateText(
            tripDetails?.location,
            currentLanguage
          );
          setTranslatedActivity({
            location: translatedPlaceName,
          });
        } else {
          setTranslatedActivity({
            location: tripDetails?.location,
          });
        }
      } catch (error) {
        console.error("Translation failed:", error);
        setTranslatedActivity({
          location: tripDetails?.location,
        });
      }
    };

    translateActivityDetails();
  }, [tripDetails, currentLanguage]);

  const formatData = (data) => {
    try {
      if (typeof data === "string") {
        return JSON.parse(data);
      }
      return data;
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

  const titleKey = `MISC.${formatData(
    tripDetails?.tripData
  )?.traveler.title.toUpperCase()}`;

  return (
    tripDetails && (
      <ScrollView
        style={{
          paddingTop: 30,
          backgroundColor: Colors.WHITE,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{
            uri:
              "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
              formatData(tripDetails?.tripData).locationInfo?.photoRef +
              "&key=" +
              GOOGLE_API_KEY,
          }}
          style={{
            width: "100%",
            height: 330,
          }}
        />
        <View
          style={{
            padding: 15,
            backgroundColor: Colors.WHITE,
            height: "100%",
            marginTop: -30,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Text
            style={{
              fontSize: 25,
              fontFamily: "outfit-bold",
            }}
          >
            {translatedActivity?.location}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 18,
                color: Colors.GRAY,
              }}
            >
              {moment(formatData(tripDetails?.tripData)?.startDate).format(
                "DD MMM yyyy"
              )}
            </Text>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 18,
                color: Colors.GRAY,
              }}
            >
              -{" "}
              {moment(formatData(tripDetails?.tripData)?.endDate).format(
                "DD MMM yyyy"
              )}
            </Text>
          </View>
          <Text
            style={{
              fontFamily: "outfit-regular",
              fontSize: 17,
              color: Colors.GRAY,
            }}
          >
            🚋 {TRANSLATE(titleKey)}
          </Text>

          <HotelList hotelList={tripDetails?.tripPlan?.hotels} />
          <PlannedTrip
            details={tripDetails?.tripPlan?.dailyPlans}
            location={tripDetails?.location}
            tripData={tripDetails?.tripData}
          />
          <View
            style={{
              backgroundColor: Colors.PRIMARY,
              padding: 15,
              marginBottom: 50,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {isEnded ? (
              <Text style={{ color: Colors.WHITE, fontSize: 18 }}>
                {TRANSLATE("MISC.THE_TRIP_HAS_ENDED")}
              </Text>
            ) : (
              <Text style={{ color: Colors.WHITE, fontSize: 18 }}>
                {TRANSLATE("MISC.THE_TRIP_IS_ONGOING")}
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    )
  );
};

export default TripDetails;

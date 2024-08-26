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

const TripDetails = () => {
  const navigation = useNavigation();
  const router = useRouter();

  const { trip } = useLocalSearchParams();

  const [tripDetails, setTripDetails] = useState(null);
  const [isEnded, setIsEnded] = useState(false);
  console.log("isEnded:", isEnded);

  // const data = tripDetails ? JSON.parse(tripDetails.tripData) : null;
  // console.log("date:", data.endDate);

  // if (data) {
  //   const endDate = new Date(data.endDate);
  //   console.log("End Date:", endDate);

  //   const currentDate = new Date();
  //   console.log("Current Date:", currentDate);

  //   // Check if the end date has passed
  //   const isEnded = endDate < currentDate;
  //   setIsEnded(isEnded);
  // }

  useEffect(() => {
    if (tripDetails) {
      const data = tripDetails ? JSON.parse(tripDetails.tripData) : null;
      const endDate = new Date(data?.endDate);
      // console.log("End Date:", endDate);

      const currentDate = new Date();
      console.log("Current Date:", currentDate);

      // Check if the end date has passed
      const isEnded = endDate < currentDate;
      setIsEnded(isEnded);
    }
  }, [tripDetails]); // Dependency array includes tripDetails

  const formatData = (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return null;
    }
  };

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

  return (
    tripDetails && (
      <ScrollView
        style={{
          // padding: 25,
          paddingTop: 30,
          // height: "100%",
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
            {tripDetails?.location}
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
            🚋 {formatData(tripDetails?.tripData)?.traveler.title}
          </Text>
          {/* Flight Info  */}
          {/* <FlightInfo
            flightData={
              tripDetails?.tripPlan?.flightPrice ||
              tripDetails?.tripPlan?.flight
            }
          /> */}

          {/* Hotel LIsts  */}
          <HotelList hotelList={tripDetails?.tripPlan?.hotels} />

          {/* Trip Day planner info */}

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
                The trip has ended
              </Text>
            ) : (
              <Text style={{ color: Colors.WHITE, fontSize: 18 }}>
                The trip is ongoing
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    )
  );
};

export default TripDetails;

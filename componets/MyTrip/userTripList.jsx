import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { Colors } from "../../constants/Colors";
import UserTripCard from "./userTripCard";
import { GOOGLE_API_KEY } from "../../env";
import { useRouter } from "expo-router";

export default function UserTripList({ userTrips, setUserTrips, onDelete }) {
  const router = useRouter();

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
              width: "100%",
              height: 240,
              objectFit: "cover",
              borderRadius: 15,
            }}
          />
        ) : (
          <Image
            source={require("../../assets/images/login.jpg")}
            style={{
              width: "100%",
              height: 240,
              objectFit: "cover",
              borderRadius: 15,
            }}
          />
        )}

        <View style={{ marginTop: 10 }}>
          <Text style={{ fontFamily: "outfit-medium", fontSize: 20 }}>
            {LatestTrip?.locationInfo?.name || "Location Name"}
          </Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 17,
                color: Colors.GRAY,
              }}
            >
              {LatestTrip.startDate
                ? moment(LatestTrip.startDate).format("DD MMM yyyy")
                : "Date"}
            </Text>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 17,
                color: Colors.GRAY,
              }}
            >
              🚋 {LatestTrip?.traveler?.title || "Traveler"}
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
              backgroundColor: Colors.PRIMARY,
              padding: 15,
              borderRadius: 15,
              marginTop: 10,
            }}
          >
            <Text
              style={{
                color: Colors.WHITE,
                fontSize: 15,
                fontFamily: "outfit-medium",
                textAlign: "center",
              }}
            >
              See your plan
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

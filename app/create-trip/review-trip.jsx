import { View, Text, TouchableOpacity } from "react-native";
import React, { useContext, useEffect } from "react";
import { useNavigation, useRouter } from "expo-router";
import { CreateTripContext } from "../../context/CreateTripContext";
import { Colors } from "../../constants/Colors";
import moment from "moment";

const ReviewTrip = () => {
  const navigation = useNavigation();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
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
      <Text
        style={{
          fontFamily: "outfit-bold",
          fontSize: 35,
          marginTop: 20,
        }}
      >
        Review your Trip
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          Before generating your trip, please Review your selection
        </Text>
        {/* Destination info */}
        <View
          style={{
            marginTop: 40,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 30 }}>📍</Text>
          <View>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
                color: Colors.GRAY,
              }}
            >
              Destination
            </Text>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
              }}
            >
              {tripData?.locationInfo?.name}
            </Text>
          </View>
        </View>
        {/* TravelDate */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 30 }}>🗓️</Text>
          <View>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
                color: Colors.GRAY,
              }}
            >
              Travel Date
            </Text>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
              }}
            >
              {moment(tripData?.startDate).format("DD MMM") +
                " to " +
                moment(tripData?.endDate).format("DD MMM")}{" "}
              ({tripData?.totalNoOfDays} days)
            </Text>
          </View>
        </View>
        {/* Who is Traveling */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 30 }}>🚊</Text>
          <View>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
                color: Colors.GRAY,
              }}
            >
              Who is Traveling
            </Text>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
              }}
            >
              {tripData?.traveler?.title}
            </Text>
          </View>
        </View>
        {/* Budget Info */}
        <View
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            gap: 20,
          }}
        >
          <Text style={{ fontSize: 30 }}>💰</Text>
          <View>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
                color: Colors.GRAY,
              }}
            >
              Budget
            </Text>
            <Text
              style={{
                fontFamily: "outfit-regular",
                fontSize: 20,
              }}
            >
              {tripData?.budget}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.replace("/create-trip/generate-trip")}
        style={{
          padding: 15,
          marginTop: 80,
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
          Build My trip
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewTrip;

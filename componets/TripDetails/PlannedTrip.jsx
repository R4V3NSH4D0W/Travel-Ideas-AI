import { View, Text, Image, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";

import PlanCard from "./planCard";
import { getCoordinates } from "../../services/GooglePlaceApi";
import { fetchWeather } from "../../services/weatherReport";
import WeatherCard from "./WeatherCard";
import { TRANSLATE } from "../../app/i18n/translationHelper";

export default function PlannedTrip({ details = [], location, tripData }) {
  const trip = JSON.parse(tripData);
  const { startDate, endDate } = trip;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const [weatherData, setWeatherData] = useState({});

  const [coordinates, setCoordinates] = useState(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const data = await getCoordinates(location);

        setCoordinates(data);
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    if (location) {
      fetchCoordinates();
    }
  }, [location]);

  const generateDateList = (start, end) => {
    const dateList = [];
    let currentDate = new Date(start);
    while (currentDate <= new Date(end)) {
      dateList.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateList;
  };

  const dateList = generateDateList(startDate, endDate);

  function removeDayPrefix(dayString) {
    return dayString.replace(/^Day\s/, "");
  }

  return (
    <View style={{ marginTop: 10 }}>
      <Text
        style={{ fontSize: 20, fontFamily: "outfit-bold", marginBottom: 20 }}
      >
        🔥 {TRANSLATE("MISC.PLAN_DETAILS")}
      </Text>
      {details.map((day, index) => {
        const date = dateList[index];

        const formattedDate = date
          ? date.toLocaleDateString("en-GB").split("/").join("/")
          : null;
        return (
          <View key={index} style={{ marginBottom: 20 }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: "outfit-bold",
                marginBottom: 5,
              }}
            >
              {TRANSLATE("MISC.DAY")} {removeDayPrefix(day.day)}
            </Text>
            {/* <Text
              style={{
                fontSize: 16,
                fontFamily: "outfit-regular",
                marginBottom: 10,
              }}
            > */}
            <WeatherCard date={formattedDate} coordinates={coordinates} />
            {/* </Text> */}
            {day.activities &&
              day.activities.map((activity, actIndex) => (
                <PlanCard
                  key={actIndex}
                  activity={activity}
                  location={location}
                />
              ))}
          </View>
        );
      })}
    </View>
  );
}

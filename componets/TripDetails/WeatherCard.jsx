import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { Colors } from "../../constants/Colors";
import { TRANSLATE } from "../../app/i18n/translationHelper";
import { fetchWeatherData } from "../../services/weatherReport";
import WeatherSkeleton from "../../app/skeleton/weather_Skeleton";

const getWeatherEmoji = (condition) => {
  switch (condition.toLowerCase()) {
    case "clear":
      return "☀️";
    case "partly cloudy":
      return "⛅";
    case "cloudy":
      return "☁️";
    case "heavy rain":
      return "🌧️";
    case "light rain":
      return "🌦️";
    case "moderate rain":
      return "🌦️";
    case "patchy rain nearby":
      return "🌦️";
    case "thunderstorm":
      return "⛈️";
    case "snow":
      return "❄️";
    case "fog":
      return "🌫️";
    default:
      return "🌈";
  }
};

const getTravelSuggestion = (condition) => {
  const lowerCaseCondition = condition.toLowerCase();

  if (lowerCaseCondition.includes("heavy rain")) {
    return TRANSLATE("WEATHER.HEAVY_RAIN");
  }
  if (lowerCaseCondition.includes("fog")) {
    return TRANSLATE("WEATHER.FOG");
  }
  if (lowerCaseCondition.includes("snow")) {
    return TRANSLATE("WEATHER.SNOW");
  }
  if (lowerCaseCondition.includes("thunderstorm")) {
    return TRANSLATE("WEATHER.THUNDERSTORM");
  }
  if (lowerCaseCondition.includes("moderate rain")) {
    return TRANSLATE("WEATHER.MODERATE_RAIN");
  }
  if (lowerCaseCondition.includes("light rain")) {
    return TRANSLATE("WEATHER.LIGHT_RAIN");
  }
  if (lowerCaseCondition.includes("patchy rain")) {
    return TRANSLATE("WEATHER.PATCHY_RAIN");
  }
  if (lowerCaseCondition.includes("clear")) {
    return TRANSLATE("WEATHER.CLEAR");
  }
  if (lowerCaseCondition.includes("partly cloudy")) {
    return TRANSLATE("WEATHER.PARTLY_CLOUDY");
  }
  if (lowerCaseCondition.includes("overcast")) {
    return TRANSLATE("WEATHER.OVERCAST");
  }

  return TRANSLATE("WEATHER.DEFAULT");
};

export default function WeatherCard({ date, coordinates }) {
  const [weatherData, setWeatherData] = useState(null);
  const [showMore, setShowMore] = useState(false);

  const convertDateToISO = (inputDate) => {
    const [day, month, year] = inputDate.split("/").map(Number);
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;
  };

  const formattedDate = convertDateToISO(date);

  useEffect(() => {
    const fetchWeather = async () => {
      if (coordinates && formattedDate) {
        const data = await fetchWeatherData(
          coordinates.latitude,
          coordinates.longitude,
          formattedDate
        );
        setWeatherData(data);
      }
    };

    fetchWeather();
  }, [formattedDate, coordinates]);

  if (!weatherData) {
    return <WeatherSkeleton />;
  }

  const dayData = weatherData?.forecast?.forecastday?.[0]?.day;
  const condition = dayData?.condition?.text || "N/A";
  const temperatureAvg = dayData?.avgtemp_c || "N/A";
  const temperatureMax = dayData?.maxtemp_c || "N/A";
  const temperatureMin = dayData?.mintemp_c || "N/A";
  const humidity = dayData?.avghumidity || "N/A";
  const windSpeed = dayData?.maxwind_kph || "N/A";
  const precipitation = dayData?.totalprecip_mm || "N/A";
  const weatherEmoji = getWeatherEmoji(condition);
  const travelSuggestion = getTravelSuggestion(condition);

  const getWeather = () => {
    if (condition !== "N/A") {
      return TRANSLATE(`WEATHER.${condition.toUpperCase()}`);
    } else {
      return "N/A";
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        setShowMore(!showMore);
      }}
      style={styles.container}
    >
      <Text style={styles.title}>
        {TRANSLATE("WEATHER.WEATHER_REPORT_FOR")} {date}
      </Text>
      <Text style={styles.text}>
        {weatherEmoji} {TRANSLATE("WEATHER.WEATHER")}: {getWeather()}
      </Text>
      <Text style={styles.text}>
        {TRANSLATE("WEATHER.AVG_TEMP")}: {temperatureAvg}°C |
        {TRANSLATE("WEATHER.MAX_TEMP")}: {temperatureMax}°C |
        {TRANSLATE("WEATHER.MIN_TEMP")}: {temperatureMin}°C
      </Text>
      {showMore && (
        <View>
          <Text style={styles.text}>
            {TRANSLATE("WEATHER.HUMIDITY")}: {humidity}%
          </Text>
          <Text style={styles.text}>
            {TRANSLATE("WEATHER.WIND_SPEED")}: {windSpeed} km/h
          </Text>
          <Text style={styles.text}>
            {TRANSLATE("WEATHER.PRECIPITATION")}: {precipitation} mm
          </Text>
        </View>
      )}
      {travelSuggestion && (
        <Text style={styles.suggestion}>{travelSuggestion}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    width: "100%",
    borderRadius: 10,
    marginBottom: 20,
    borderColor: "#ddd",
    backgroundColor: Colors.EXTREME_LIGHT_GRAY,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "outfit-bold",
  },
  text: {
    fontSize: 16,
    fontFamily: "outfit-regular",
  },
  suggestion: {
    fontSize: 16,
    color: "red",
    marginTop: 5,
    fontFamily: "outfit-bold",
  },
  button: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
});

import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../../services/weatherReport";
import { Colors } from "../../constants/Colors";
import WeatherSkeleton from "../../app/skeleton/weather_Skeleton";
import { TRANSLATE } from "../../app/i18n/translationHelper";

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
        {weatherEmoji} {TRANSLATE("WEATHER.WEATHER")}:
        {condition === null
          ? TRANSLATE(`WEATHER.${condition.toUpperCase()}`)
          : "N/A"}
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
    width: "100%",
    // borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: Colors.EXTREME_LIGHT_GRAY,
    // shadowColor: "#000",
  },
  title: {
    fontSize: 18,
    fontFamily: "outfit-bold",
    marginBottom: 10,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 16,
  },
  suggestion: {
    fontSize: 16,
    color: "red",
    fontFamily: "outfit-bold",
    marginTop: 5,
  },
  button: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
  },
});

import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { fetchWeatherData } from "../../services/weatherReport";
import { Colors } from "../../constants/Colors";

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
    return "It's better to postpone your plans due to heavy rain.";
  }
  if (lowerCaseCondition.includes("fog")) {
    return "It's better to postpone your plans due to fog.";
  }
  if (lowerCaseCondition.includes("snow")) {
    return "It's better to postpone your plans due to snow.";
  }
  if (lowerCaseCondition.includes("thunderstorm")) {
    return "Consider postponing your plans due to thunderstorms.";
  }
  if (lowerCaseCondition.includes("moderate rain")) {
    return "Bring a raincoat or umbrella for moderate rain.";
  }
  if (lowerCaseCondition.includes("light rain")) {
    return "A light rain is expected. Carry an umbrella just in case.";
  }
  if (lowerCaseCondition.includes("patchy rain")) {
    return "Bring a raincoat or umbrella for patchy rain.";
  }
  if (lowerCaseCondition.includes("clear")) {
    return "The weather looks clear. Enjoy your day!";
  }
  if (lowerCaseCondition.includes("partly cloudy")) {
    return "It's partly cloudy. A light jacket might be useful.";
  }
  if (lowerCaseCondition.includes("overcast")) {
    return "The sky is overcast. Dress comfortably for the cooler weather.";
  }

  return "No specific suggestions for the current weather condition.";
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
    return <Text>Loading weather data...</Text>;
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
      <Text style={styles.title}>Weather Report for {date}</Text>
      <Text style={styles.text}>
        {weatherEmoji} Weather: {condition}
      </Text>
      <Text style={styles.text}>
        Avg Temp: {temperatureAvg}°C | Max Temp: {temperatureMax}°C | Min Temp:{" "}
        {temperatureMin}°C
      </Text>
      {showMore && (
        <View>
          <Text style={styles.text}>Humidity: {humidity}%</Text>
          <Text style={styles.text}>Wind Speed: {windSpeed} km/h</Text>
          <Text style={styles.text}>Precipitation: {precipitation} mm</Text>
        </View>
      )}
      {travelSuggestion && (
        <Text style={styles.suggestion}>{travelSuggestion}</Text>
      )}
      {/* <TouchableOpacity
        onPress={() => {
          setShowMore(!showMore);
        }}
        style={{
          backgroundColor: Colors.PRIMARY,
          justifyContent: "center",
          alignItems: "center",
          height: 40,
          marginTop: 5,
          borderRadius: 10,
        }}
      >
        {showMore ? (
          <Text style={styles.button}>View Less</Text>
        ) : (
          <Text style={styles.button}>View More</Text>
        )}
      </TouchableOpacity> */}
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

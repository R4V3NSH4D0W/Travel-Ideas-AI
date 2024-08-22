import { WEATHER_API_KEY } from "../env";

export const fetchWeatherData = async (latitude, longitude, date) => {
  const url = `https://api.weatherapi.com/v1/forecast.json?q=${latitude},${longitude}&dt=${date}&key=${WEATHER_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

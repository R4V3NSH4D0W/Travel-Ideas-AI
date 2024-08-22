import { UAT_GOOGLE_KEY } from "../env";

export const GetPhotoRef = async (placeName) => {
  if (!placeName) {
    console.error("Place name is undefined");
    return;
  }

  const res = await fetch(
    "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
      encodeURIComponent(placeName) +
      "&key=" +
      UAT_GOOGLE_KEY
  );
  const result = await res.json();

  return result || null;
};

export const getCoordinates = async (placeName) => {
  console.log("getCoordinates", placeName);
  try {
    const encodedPlaceName = encodeURIComponent(placeName);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedPlaceName}&key=${UAT_GOOGLE_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    console.error("Failed to fetch coordinates:", error);
    return null;
  }
};

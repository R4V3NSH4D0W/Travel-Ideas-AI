export const SelectTravelerList = [
  {
    id: 1,
    title: "Just me",
    desc: "A sole traveles in exploration",
    icon: "✈️",
    people: "1",
  },
  {
    id: 2,
    title: "A Couple",
    desc: "two travelers in exploration",
    icon: "🥂",
    people: "2",
  },
  {
    id: 3,
    title: "Family",
    desc: "A group of Fun Loving Adventurers",
    icon: "🏡",
    people: "3 to 5 people",
  },
  {
    id: 4,
    title: "Friends",
    desc: "A bunch of thrill-seekes",
    icon: "⛵",
    people: "5 to 10",
  },
];

export const SelectBudgetOption = [
  {
    id: 1,
    title: "Cheap",
    desc: "stay conscious of cost",
    icon: "💸",
  },
  {
    id: 2,
    title: "Moderate",
    desc: "Keep cost on Average spending",
    icon: "💰",
  },
  {
    id: 3,
    title: "Luxury",
    desc: "Dont worry about cost",
    icon: "💎",
  },
];

export const languageOptions = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Chinese (Simplified)", value: "zh-CN" },
  { label: "Chinese (Traditional)", value: "zh-TW" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Russian", value: "ru" },
  { label: "Portuguese", value: "pt" },
  { label: "Italian", value: "it" },
  { label: "Dutch", value: "nl" },
  { label: "Turkish", value: "tr" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
  { label: "Bengali", value: "bn" },
  { label: "Vietnamese", value: "vi" },
  { label: "Thai", value: "th" },
  { label: "Swedish", value: "sv" },
  { label: "Danish", value: "da" },
  { label: "Norwegian", value: "no" },
  { label: "Finnish", value: "fi" },
  { label: "Polish", value: "pl" },
  { label: "Czech", value: "cs" },
  { label: "Hungarian", value: "hu" },
  { label: "Romanian", value: "ro" },
  { label: "Hebrew", value: "he" },
  { label: "Greek", value: "el" },
  { label: "Ukrainian", value: "uk" },
  { label: "Malay", value: "ms" },
  { label: "Indonesian", value: "id" },
  { label: "Filipino", value: "tl" },
  { label: "Swahili", value: "sw" },
  { label: "Nepali", value: "ne" },
];

export const AI_PROMPT = `
Generate a Travel Plan for Location: {location} for {totalDays} Days and {totalNights} Nights for {traveler} with a {budget} Budget.

Include the following details in JSON format:

{
  "flight": {
    "price": "Flight Price (e.g., 200$)",
    "bookingURL": "Booking URL",
    "airline": "Airline Name"
  },
  "hotels": [
    {
      "name": "Hotel Name",
      "address": "Hotel Address",
      "price": "Price (e.g., 30$-40$ per night)",
      "websiteURL": "Hotel Website URL",
      "imageURL": "Hotel Image URL",
      "geoCoordinates": {
        "latitude": "Latitude",
        "longitude": "Longitude"
      },
      "rating": "Rating",
      "description": "Description"
    }
  ],
  "placesToVisit": [
    {
      "name": "Place Name",
      "details": "Place Details",
      "imageURL": "Place Image URL",
      "geoCoordinates": {
        "latitude": "Latitude",
        "longitude": "Longitude"
      },
      "ticketPricing": "Ticket Pricing (e.g., 15$ per person)",
      "timeToTravel": "Time to Travel to each location"
    }
  ],
  "dailyPlans": [
    {
      "day": "Day Number",
      "activities": [
        {
          "placeName": "Place Name",
          "placeDetails": "Place Details",
          "placeImageURL": "Place Image URL",
          "timeToTravelBetweenPlaces": "Time To Travel Between Places",
          "geoCoordinates": {
            "latitude": "Latitude",
            "longitude": "Longitude"
          },
          "ticketPricing": "Ticket Pricing (e.g., 10$ per ticket)"
        }
      ],
      "bestTimeToVisit": "Best Time to Visit"
    }
  ],
  "hotelRequirement": "Ensure that all hotels listed are located in {location}. Prices should be formatted as '30$-40$ per night' or similar."
}
`;

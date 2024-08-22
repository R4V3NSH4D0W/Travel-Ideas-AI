import { View, Text, Image } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Colors } from "../../constants/Colors";
import { CreateTripContext } from "../../context/CreateTripContext";
import { AI_PROMPT } from "../../constants/Options";
import { chatSession } from "../../configs/AiModal";
import { useRouter } from "expo-router";
import { auth, db } from "../../configs/FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

const GenerateTrip = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);
  console.log("tripData", tripData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;
  useEffect(() => {
    GenerateAiTrip();
  }, []);

  const GenerateAiTrip = async () => {
    try {
      setLoading(true);

      const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",
        tripData?.locationInfo?.name
      )
        .replace("{totalDays}", tripData?.totalNoOfDays)
        .replace("{totalNight}", tripData?.totalNoOfDays - 1)
        .replace("{traveler}", tripData?.traveler?.title)
        .replace("{budget}", tripData?.budget)
        .replace("{totalDays}", tripData?.totalNoOfDays)
        .replace("{totalNight}", tripData?.totalNoOfDays - 1);

      const result = await chatSession.sendMessage(FINAL_PROMPT);
      const resultText = await result.response.text();

      const tripResp = JSON.parse(resultText);

      const docId = Date.now().toString();
      await setDoc(doc(db, "UserTrips", docId), {
        userEmail: user.email,
        tripPlan: tripResp,
        location: tripData?.locationInfo?.name,
        uniqueID: docId,
        tripData: JSON.stringify(tripData),
      });

      setLoading(false);
      router.push("(tabs)/mytrip");
    } catch (error) {
      console.error("Error generating trip:", error);
      setLoading(false);
    }
  };

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
          textAlign: "center",
        }}
      >
        Please wait...
      </Text>
      <Text
        style={{
          fontSize: 20,
          marginTop: 40,
          textAlign: "center",
          fontFamily: "outfit-bold",
        }}
      >
        We are working to generate your dream trip
      </Text>
      <Image
        source={require("../../assets/images/loading.gif")}
        style={{ width: "100%", height: 300, objectFit: "contain" }}
      />
      <Text
        style={{
          fontFamily: "outfit-regular",
          color: Colors.GRAY,
          fontSize: 20,
          textAlign: "center",
        }}
      >
        Do not Go Back
      </Text>
    </View>
  );
};

export default GenerateTrip;

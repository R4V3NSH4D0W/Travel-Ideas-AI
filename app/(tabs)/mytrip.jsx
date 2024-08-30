import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";

import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import {
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  collection,
} from "firebase/firestore";

import { Colors } from "../../constants/Colors";
import { TRANSLATE } from "../i18n/translationHelper";
import { db, auth } from "../../configs/FirebaseConfig";
import UserTripList from "../../componets/MyTrip/userTripList";
import StartNewTripCard from "../../componets/MyTrip/StartNewTripCard";

export default function MyTrip() {
  const [loading, setLoading] = useState(false);
  const [userTrips, setUserTrips] = useState([]);

  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      GetMyTrips();
    }
  }, [user]);

  const GetMyTrips = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "UserTrips"),
        where("userEmail", "==", user.email)
      );
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        uniqueID: doc.id,
      }));
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching trips:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!auth.currentUser) {
      console.error("User not authenticated");
      return;
    }

    try {
      const docRef = doc(db, "UserTrips", id);
      await deleteDoc(docRef);
      GetMyTrips();
      ToastAndroid.show(
        TRANSLATE("MESSAGES.TRIP_DELETED_SUCCESSFULLY"),
        ToastAndroid.SHORT
      );
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{TRANSLATE("MISC.MY_TRIPS")}</Text>
        <TouchableOpacity
          onPress={() => router.push("/create-trip/search-place")}
        >
          <Ionicons name="add-circle" size={50} color="black" />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={Colors.PRIMARY} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {userTrips.length === 0 ? (
            <StartNewTripCard />
          ) : (
            <UserTripList
              userTrips={userTrips}
              setUserTrips={setUserTrips}
              onDelete={handleDelete}
            />
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 55,
    backgroundColor: Colors.WHITE,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    paddingHorizontal: 25,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 35,
    fontFamily: "outfit-bold",
  },
  scrollView: {
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
});

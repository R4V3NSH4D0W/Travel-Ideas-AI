import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import StartNewTripCard from "../../componets/MyTrip/StartNewTripCard";
import UserTripList from "../../componets/MyTrip/userTripList";
import {
  doc,
  query,
  where,
  getDocs,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { db, auth } from "../../configs/FirebaseConfig";
import { useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { TRANSLATE } from "../i18n/translationHelper";

export default function MyTrip() {
  const [userTrips, setUserTrips] = useState([]);
  const [loading, setLoading] = useState(false);
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
      ToastAndroid.show("Trip deleted successfully", ToastAndroid.SHORT);
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 20,
  },
  title: {
    fontFamily: "outfit-bold",
    fontSize: 35,
  },
  scrollView: {
    paddingHorizontal: 25,
    paddingBottom: 20,
  },
});

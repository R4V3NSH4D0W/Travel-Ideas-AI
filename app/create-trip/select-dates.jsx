import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { CreateTripContext } from "../../context/CreateTripContext";
import { TRANSLATE } from "../i18n/translationHelper";

const SelectDate = () => {
  const { tripData, setTripData } = useContext(CreateTripContext);

  const navigation = useNavigation();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const router = useRouter();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerTransparent: true,
    });
  }, []);

  const onDateChange = (date, type) => {
    if (type == "START_DATE") {
      setStartDate(moment(date));
    } else {
      setEndDate(moment(date));
    }
  };
  const onDateSelectionContinue = () => {
    if (!startDate || !endDate) {
      ToastAndroid.show(
        TRANSLATE("ALERT.PLEASE_SELECT_START_AND_END_DATE"),
        ToastAndroid.LONG
      );
      return;
    }
    const totalNoOfDays = endDate.diff(startDate, "days");
    setTripData({
      ...tripData,
      startDate: startDate,
      endDate: endDate,
      totalNoOfDays: totalNoOfDays + 1,
    });
    router.push("/create-trip/select-budget");
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
          fontSize: 35,
          marginTop: 20,
          fontFamily: "outfit-bold",
        }}
      >
        {TRANSLATE("MISC.TRAVEL_DATE")}
      </Text>
      <View style={{ marginTop: 30 }}>
        <CalendarPicker
          onDateChange={onDateChange}
          allowRangeSelection={true}
          minDate={new Date()}
          maxRangeDuration={5}
          selectedRangeStyle={{
            backgroundColor: Colors.PRIMARY,
          }}
          selectedDayTextStyle={{
            color: Colors.WHITE,
          }}
        />
      </View>
      <TouchableOpacity
        onPress={onDateSelectionContinue}
        style={{
          padding: 15,
          marginTop: 35,
          borderRadius: 15,
          backgroundColor: Colors.PRIMARY,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            color: Colors.WHITE,
            fontFamily: "outfit-medium",
            fontSize: 20,
          }}
        >
          {TRANSLATE("MISC.CONTINUE")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SelectDate;

const styles = StyleSheet.create({});

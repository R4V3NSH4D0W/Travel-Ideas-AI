import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation, useRouter } from "expo-router";
import { Colors } from "../../constants/Colors";
import { SelectBudgetOption } from "../../constants/Options";
import OptionCard from "../../componets/CreateTrip/OptionCard";
import { CreateTripContext } from "../../context/CreateTripContext";
import { ToastAndroid } from "react-native";
import { TRANSLATE } from "../i18n/translationHelper";

export default function SelectBudget() {
  const navigation = useNavigation();
  const router = useRouter();
  const { tripData, setTripData } = useContext(CreateTripContext);
  const [selectedOption, setSelectedOption] = useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "",
      headerTransparent: true,
    });
  }, []);

  useEffect(() => {
    setTripData({ ...tripData, budget: selectedOption?.title });
  }, [selectedOption]);

  const onClickContinue = () => {
    if (!selectedOption) {
      ToastAndroid.show(
        TRANSLATE("ALERT.PLEASE_SELECT_BUDGET_OPTION"),
        ToastAndroid.LONG
      );
      return;
    }
    router.push("/create-trip/review-trip");
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
          fontSize: 30,
          marginTop: 20,
        }}
      >
        {TRANSLATE("MISC.BUDGET")}
      </Text>
      <View
        style={{
          marginTop: 20,
        }}
      >
        <Text
          style={{
            fontFamily: "outfit-bold",
            fontSize: 20,
          }}
        >
          {TRANSLATE("MISC.SPENDING_HABIT")}
        </Text>
        <FlatList
          data={SelectBudgetOption}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => setSelectedOption(item)}
              style={{ marginVertical: 10 }}
            >
              <OptionCard
                option={item}
                title={TRANSLATE(`BUDGET.${item.id}_TITLE`)}
                desc={TRANSLATE(`BUDGET.${item.id}_DESC`)}
                selectedOption={selectedOption}
              />
            </TouchableOpacity>
          )}
        />
      </View>
      <TouchableOpacity
        onPress={onClickContinue}
        style={{
          padding: 15,
          marginTop: 20,
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
}

import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { StyleSheet, View, Image, Text } from "react-native";

import i18next from "i18next";
import BottomSheet from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Colors } from "../../constants/Colors";
import AACamera from "../../componets/camera/Camera";
import { TRANSLATE } from "../i18n/translationHelper";
import { appTranslateText } from "../../services/translationService";
import { analyzeImage } from "../../services/ImageReconizationHelpers";

export default function ImageRecognization() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const [translatedActivity, setTranslatedActivity] = useState(null);

  const currentLanguage = i18next.language;

  const MIN_HEIGHT = 300;
  const MAX_HEIGHT = 700;

  const handleImageCaptured = (uri, base64) => {
    setImage(uri);
    analyzeImage(base64, setLoading, setTitle, setDetails);
    setBottomSheetIndex(0);
  };

  const NavBar = () => (
    <View style={styles.navBar}>
      <Ionicons
        size={26}
        name="arrow-back"
        color={Colors.WHITE}
        onPress={() => setImage(null)}
        style={{ position: "absolute", top: 20, left: 20 }}
      />
      <Text
        style={{ fontFamily: "outfit-bold", fontSize: 20, color: Colors.WHITE }}
      >
        {TRANSLATE("MISC.LANDMARK_DETECTION")}
      </Text>
    </View>
  );

  useEffect(() => {
    const translateActivityDetails = async () => {
      try {
        if (currentLanguage !== "en" && details) {
          const translatedDetail = await appTranslateText(
            details,
            currentLanguage
          );
          const translatedTitle = await appTranslateText(
            title,
            currentLanguage
          );
          setTranslatedActivity({
            details: translatedDetail,
            title: translatedTitle,
          });
        } else {
          setTranslatedActivity({
            title: title,
            details: details,
          });
        }
      } catch (error) {
        setTranslatedActivity({
          title: title,
          details: details,
        });
      }
    };

    translateActivityDetails();
  }, [details, currentLanguage]);

  return (
    <View style={styles.container}>
      {image ? (
        <>
          <NavBar />
          <Image source={{ uri: image }} style={styles.imagePreview} />
          <BottomSheet
            index={bottomSheetIndex}
            snapPoints={[MIN_HEIGHT, MAX_HEIGHT]}
            handleStyle={styles.bottomSheetHandle}
            backgroundStyle={styles.bottomSheetBackground}
            onChange={(index) => setBottomSheetIndex(index)}
          >
            <View style={styles.bottomSheetContent}>
              {!loading && details ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text
                    style={{
                      fontSize: 18,
                      paddingBottom: 10,
                      fontFamily: "outfit-bold",
                    }}
                  >
                    {translatedActivity?.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      textAlign: "justify",
                      color: Colors.PRIMARY,
                      fontFamily: "outfit-regular",
                    }}
                  >
                    {translatedActivity?.details}
                  </Text>
                </ScrollView>
              ) : (
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ fontFamily: "outfit-regular", fontSize: 16 }}>
                    Loading...
                  </Text>
                  <Image
                    source={require("../../assets/images/loadingIndi.gif")}
                    style={{
                      zIndex: -1,
                      width: "50%",
                      height: "50%",
                      marginTop: -50,
                    }}
                  />
                </View>
              )}
            </View>
          </BottomSheet>
        </>
      ) : (
        <AACamera onImageCaptured={handleImageCaptured} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  navBar: {
    zIndex: 1,
    padding: 20,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheetBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetHandle: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetContent: {
    flexGrow: 1,
    padding: 20,
  },
  imagePreview: {
    width: "100%",
    height: "70%",
    marginTop: -70,
    resizeMode: "cover",
  },
});

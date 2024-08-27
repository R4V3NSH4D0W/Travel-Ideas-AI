import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "../../constants/Colors";
import BottomSheet from "@gorhom/bottom-sheet";
import AACamera from "../../componets/camera/Camera";
import { ScrollView } from "react-native-gesture-handler";
import { analyzeImage } from "../../services/ImageReconizationHelpers";
import { TRANSLATE } from "../i18n/translationHelper";
import i18next from "i18next";
import { appTranslateText } from "../../services/translationService";

export default function ImageRecognization() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
  const currentLanguage = i18next.language;
  const [translatedActivity, setTranslatedActivity] = useState(null);

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
        name="arrow-back"
        size={26}
        color={Colors.WHITE}
        style={{ position: "absolute", top: 20, left: 20 }}
        onPress={() => setImage(null)}
      />
      <Text
        style={{ fontFamily: "outfit-bold", fontSize: 20, color: Colors.WHITE }}
      >
        {TRANSLATE("MISC.LANDMARK_DETECTION")}
      </Text>
    </View>
  );

  useEffect(() => {
    console.log("details", details);
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
            details: details,
          });
        }
      } catch (error) {
        setTranslatedActivity({
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
            onChange={(index) => setBottomSheetIndex(index)}
            backgroundStyle={styles.bottomSheetBackground}
            handleStyle={styles.bottomSheetHandle}
          >
            <View style={styles.bottomSheetContent}>
              {!loading && details ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text
                    style={{
                      fontFamily: "outfit-bold",
                      fontSize: 18,
                      paddingBottom: 10,
                    }}
                  >
                    {translatedActivity?.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: "outfit-regular",
                      color: Colors.PRIMARY,
                      textAlign: "justify",
                    }}
                  >
                    {translatedActivity?.details}
                  </Text>
                </ScrollView>
              ) : (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontFamily: "outfit-regular", fontSize: 16 }}>
                    Loading...
                  </Text>
                  <Image
                    source={require("../../assets/images/loadingIndi.gif")}
                    style={{
                      zIndex: -1,
                      marginTop: -50,
                      width: "50%",
                      height: "50%",
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
    marginTop: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
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

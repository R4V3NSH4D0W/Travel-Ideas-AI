import {
  Text,
  View,
  Image,
  Alert,
  Switch,
  Platform,
  Animated,
  TextInput,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";

import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import LanguageSwitcher from "../../componets/languageSwitcher/language_switcher";

import {
  uploadImageToFirebase,
  loadBiometricPreference,
  verifyUserAndEnableBiometric,
  disableBiometricAuthentication,
} from "../../helper/profileScreenHelper";
import { Colors } from "../../constants/Colors";
import { auth } from "../../configs/FirebaseConfig";
import { TRANSLATE } from "../i18n/translationHelper";

import { signOut, updateProfile } from "firebase/auth";

export default function Profile() {
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(auth.currentUser?.photoURL);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [email, setEmail] = useState(auth.currentUser?.email || "");

  const [modalTranslateY] = useState(new Animated.Value(500));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const router = useRouter();
  const user = auth.currentUser;

  function getInitials(name) {
    const names = name.split(" ");
    if (names.length > 0) {
      const firstLetterOfFirstName = names[0].charAt(0).toUpperCase();
      const firstLetterOfLastName =
        names.length > 1 ? names[1].charAt(0).toUpperCase() : "";
      return `${firstLetterOfFirstName}${firstLetterOfLastName}`;
    } else {
      return "";
    }
  }

  useEffect(() => {
    const loadBiometric = async () => {
      const isEnabled = await loadBiometricPreference();
      setBiometricEnabled(isEnabled);
    };

    loadBiometric();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        ToastAndroid.show(
          TRANSLATE("MESSAGES.LOGOUT_SUCCESS"),
          ToastAndroid.SHORT
        );
        router.replace("/auth/sign-in");
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(
          TRANSLATE("MESSAGES.LOGOUT_ERROR"),
          ToastAndroid.SHORT
        );
      });
  };

  const pickImage = async () => {
    Alert.alert(
      TRANSLATE("MESSAGES.SELECT_IMAGE"),
      TRANSLATE("MESSAGES.CHOOSE_OPTION"),
      [
        { text: TRANSLATE("MESSAGES.CAMERA"), onPress: openCamera },
        { text: TRANSLATE("MESSAGES.GALLERY"), onPress: openGallery },
        { text: TRANSLATE("MESSAGES.CANCEL"), style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openGallery = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      ToastAndroid.show(
        TRANSLATE("MESSAGES.GALLERY_PERMISSION_REQUIRED"),
        ToastAndroid.SHORT
      );
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const selectedImageUri = pickerResult.assets[0].uri;
      setImage(selectedImageUri);

      if (user) {
        try {
          const downloadURL = await uploadImageToFirebase(selectedImageUri);
          await updateProfile(user, { photoURL: downloadURL });
          ToastAndroid.show(
            TRANSLATE("MESSAGES.PROFILE_IMAGE_UPDATED"),
            ToastAndroid.SHORT
          );
        } catch (error) {
          ToastAndroid.show(
            TRANSLATE("MESSAGES.PROFILE_IMAGE_UPDATE_FAILED"),
            ToastAndroid.SHORT
          );
        }
      }
    }
  };

  const openCamera = async () => {
    let result = await ImagePicker.requestCameraPermissionsAsync();
    if (result.granted === false) {
      ToastAndroid.show(
        TRANSLATE("MESSAGES.CAMERA_PERMISSION_REQUIRED"),
        ToastAndroid.SHORT
      );
      return;
    }

    let cameraResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!cameraResult.canceled) {
      const capturedImageUri = cameraResult.assets[0].uri;
      setImage(capturedImageUri);

      if (user) {
        try {
          const downloadURL = await uploadImageToFirebase(capturedImageUri);
          await updateProfile(user, { photoURL: downloadURL });
          ToastAndroid.show(
            TRANSLATE("MESSAGES.PROFILE_IMAGE_UPDATED"),
            ToastAndroid.SHORT
          );
        } catch (error) {
          ToastAndroid.show(
            TRANSLATE("MESSAGES.PROFILE_IMAGE_UPDATE_FAILED"),
            ToastAndroid.SHORT
          );
        }
      }
    }
  };

  const handleBiometricToggle = async () => {
    if (biometricEnabled) {
      await disableBiometricAuthentication();
      setBiometricEnabled(false);
    } else {
      setIsModalVisible(true);
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
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
      <View style={{ display: "flex", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontFamily: "outfit-bold" }}>
          {TRANSLATE("MISC.PROFILE")}
        </Text>
        <TouchableOpacity
          style={{
            width: 100,
            height: 100,
            marginTop: 20,
            borderRadius: 50,
            overflow: "hidden",
            alignItems: "center",
            backgroundColor: Colors.PRIMARY,
          }}
          onPress={pickImage}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Text
              style={{
                fontSize: 34,
                marginTop: 24,
                color: Colors.WHITE,
                fontFamily: "outfit-bold",
              }}
            >
              {getInitials(user?.displayName)}
            </Text>
          )}
        </TouchableOpacity>
        <View>
          <Text
            style={{
              marginTop: 20,
              fontSize: 20,
              textAlign: "center",
              fontFamily: "outfit-bold",
            }}
          >
            {user?.displayName}
          </Text>
          <Text
            style={{
              marginTop: 2,
              color: Colors.GRAY,
              textAlign: "center",
              fontFamily: "outfit-regular",
            }}
          >
            {user?.email}
          </Text>
        </View>
      </View>

      {/* Biometric Authentication Toggle */}
      <View
        style={{
          padding: 10,
          marginTop: 20,
          display: "flex",
          borderRadius: 15,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: Colors.EXTREME_LIGHT_GRAY,
        }}
      >
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="finger-print" size={24} color="black" />
          <Text style={{ fontFamily: "outfit-regular", fontSize: 16 }}>
            {TRANSLATE("MISC.ENABLE_DISABLE_BIO")}
          </Text>
        </View>
        <Switch
          style={{
            height: 40,
          }}
          value={biometricEnabled}
          thumbColor={Colors.WHITE}
          onValueChange={handleBiometricToggle}
          trackColor={{ false: Colors.GRAY, true: Colors.PRIMARY }}
        />
      </View>
      {/* TODO: Language Switcher */}
      {/* <TouchableOpacity
        onPress={() => router.push("../change-language")}
        style={{
          marginTop: 20,
          backgroundColor: Colors.EXTREME_LIGHT_GRAY,
          borderRadius: 15,
          paddingVertical: 15,
          padding: 10,
          height: 60,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: Colors.PRIMARY,
            fontFamily: "outfit-regular",
          }}
        >
          {TRANSLATE("MISC.CHANGE_LANGUAGE")}
        </Text>
      </TouchableOpacity> */}

      <TouchableOpacity
        onPress={() => router.push("../ImageRecognition")}
        style={{
          height: 60,
          padding: 10,
          marginTop: 20,
          borderRadius: 15,
          paddingVertical: 15,
          justifyContent: "center",
          backgroundColor: Colors.EXTREME_LIGHT_GRAY,
        }}
      >
        <View
          style={{
            gap: 10,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Feather name="camera" size={24} color="black" />
          <Text
            style={{
              fontSize: 16,
              color: Colors.PRIMARY,
              fontFamily: "outfit-regular",
            }}
          >
            {TRANSLATE("MISC.LANDMARK_DETECTION")}
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("../TranslateAndAsk")}
        style={{
          height: 60,
          padding: 10,
          marginTop: 20,
          borderRadius: 15,
          paddingVertical: 15,
          justifyContent: "center",
          backgroundColor: Colors.EXTREME_LIGHT_GRAY,
        }}
      >
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialIcons name="translate" size={24} color="black" />
          <Text
            style={{
              fontSize: 16,
              color: Colors.PRIMARY,
              fontFamily: "outfit-regular",
            }}
          >
            {TRANSLATE("MISC.LANGUAGE_TRANSLATOR")}
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 20,
          borderRadius: 15,
          paddingVertical: 15,
          alignItems: "center",
          backgroundColor: Colors.PRIMARY,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: Colors.WHITE,
            fontFamily: "outfit-regular",
          }}
        >
          {TRANSLATE("AUTH.LOGOUT")}
        </Text>
      </TouchableOpacity>

      {/* Overlay and Modal View */}
      {isModalVisible && (
        <>
          <TouchableWithoutFeedback
            onPress={() => setIsModalVisible(false)}
            style={StyleSheet.absoluteFillObject}
          >
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: modalTranslateY,
                  },
                ],
              },
            ]}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>
                {TRANSLATE("AUTH.ENTER_YOUR_PASSWORD")}
              </Text>
              <TextInput
                secureTextEntry
                value={password}
                style={styles.modalInput}
                onChangeText={setPassword}
                placeholder={TRANSLATE("AUTH.PASSWORD")}
              />

              <TouchableOpacity
                style={{ position: "absolute", right: 10, bottom: 0 }}
                onPress={() =>
                  verifyUserAndEnableBiometric(
                    user,
                    email,
                    password,
                    setBiometricEnabled,
                    setIsModalVisible,
                    setPassword
                  )
                }
              >
                <FontAwesome name="send" size={24} color="black" />
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Animated.View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    padding: 20,
    position: "absolute",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: Colors.WHITE,
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  modalInput: {
    padding: 10,
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 40,
    borderColor: Colors.GRAY,
  },
});

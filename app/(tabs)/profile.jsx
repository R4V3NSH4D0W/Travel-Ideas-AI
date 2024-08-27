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
import FontAwesome from "@expo/vector-icons/FontAwesome";

import {
  uploadImageToFirebase,
  loadBiometricPreference,
  verifyUserAndEnableBiometric,
  disableBiometricAuthentication,
} from "../../helper/profileScreenHelper";
import { Colors } from "../../constants/Colors";
import { auth } from "../../configs/FirebaseConfig";
import { signOut, updateProfile } from "firebase/auth";
import { TRANSLATE } from "../i18n/translationHelper";

export default function Profile() {
  const [image, setImage] = useState(auth.currentUser?.photoURL);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const router = useRouter();
  const user = auth.currentUser;

  const [modalTranslateY] = useState(new Animated.Value(500));
  const [isModalVisible, setIsModalVisible] = useState(false);

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
        ToastAndroid.show("You have been logged out.", ToastAndroid.SHORT);
        router.replace("/auth/sign-in");
      })
      .catch((error) => {
        console.error(error);
        ToastAndroid.show(
          "An error occurred while logging out.",
          ToastAndroid.SHORT
        );
      });
  };

  const pickImage = async () => {
    Alert.alert(
      "Select Image",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const openGallery = async () => {
    let result = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (result.granted === false) {
      ToastAndroid.show(
        "Permission to access gallery is required!",
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
            "Profile image updated successfully!",
            ToastAndroid.SHORT
          );
        } catch (error) {
          ToastAndroid.show(
            "Failed to update profile image.",
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
        "Permission to access camera is required!",
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
            "Profile image updated successfully!",
            ToastAndroid.SHORT
          );
        } catch (error) {
          ToastAndroid.show(
            "Failed to update profile image.",
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
            backgroundColor: Colors.PRIMARY,
            borderRadius: 50,
            marginTop: 20,
            overflow: "hidden",
          }}
          onPress={pickImage}
        >
          <Image
            source={{ uri: image || "https://example.com/default-profile.png" }}
            style={{ width: "100%", height: "100%" }}
          />
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
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.EXTREME_LIGHT_GRAY,
          padding: 10,
          marginTop: 20,
          borderRadius: 15,
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontFamily: "outfit-regular", fontSize: 16 }}>
          {TRANSLATE("MISC.ENABLE_DISABLE_BIO")}
        </Text>
        <Switch
          value={biometricEnabled}
          onValueChange={handleBiometricToggle}
          trackColor={{ false: Colors.GRAY, true: Colors.PRIMARY }}
          thumbColor={Colors.WHITE}
        />
      </View>

      <TouchableOpacity
        onPress={() => router.push("../ImageRecognition")}
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
          {TRANSLATE("MISC.LANDMARK_DETECTION")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => router.push("../TranslateAndAsk")}
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
          {TRANSLATE("MISC.LANGUAGE_TRANSLATOR")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        style={{
          marginTop: 20,
          backgroundColor: Colors.PRIMARY,
          borderRadius: 15,
          paddingVertical: 15,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Colors.WHITE,
            fontSize: 16,
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
              <Text style={styles.modalTitle}>Enter Your Password</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.WHITE,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    zIndex: 2,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalInput: {
    width: "100%",
    borderColor: Colors.GRAY,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 40,
  },
});

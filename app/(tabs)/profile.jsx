import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
  Image,
  Alert,
  Switch,
  TextInput,
  Button,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Colors } from "../../constants/Colors";
import {
  signOut,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../../configs/FirebaseConfig";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function Profile() {
  const [image, setImage] = useState(auth.currentUser?.photoURL);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(auth.currentUser?.email || "");
  const [showBiometricPrompt, setShowBiometricPrompt] = useState(false);
  const router = useRouter();
  const user = auth.currentUser;

  const [modalTranslateY] = useState(new Animated.Value(500));
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadBiometricPreference = async () => {
      const storedBiometricPreference = await SecureStore.getItemAsync(
        "biometricEnabled"
      );
      setBiometricEnabled(storedBiometricPreference === "true");
    };

    loadBiometricPreference();
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
        updateProfile(user, { photoURL: selectedImageUri })
          .then(() =>
            ToastAndroid.show(
              "Profile image updated successfully!",
              ToastAndroid.SHORT
            )
          )
          .catch((error) => {
            console.error(error);
            ToastAndroid.show(
              "Failed to update profile image.",
              ToastAndroid.SHORT
            );
          });
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
        updateProfile(user, { photoURL: capturedImageUri })
          .then(() =>
            ToastAndroid.show(
              "Profile image updated successfully!",
              ToastAndroid.SHORT
            )
          )
          .catch((error) => {
            console.error(error);
            ToastAndroid.show(
              "Failed to update profile image.",
              ToastAndroid.SHORT
            );
          });
      }
    }
  };

  const handleBiometricToggle = async () => {
    if (biometricEnabled) {
      // Disable biometric authentication
      await SecureStore.deleteItemAsync("biometricEnabled");
      await SecureStore.deleteItemAsync("userEmail");
      await SecureStore.deleteItemAsync("userPassword");
      setBiometricEnabled(false);
      ToastAndroid.show(
        "Biometric authentication disabled. Please re-enable to set up new credentials.",
        ToastAndroid.SHORT
      );
    } else {
      setIsModalVisible(true);
      Animated.timing(modalTranslateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const verifyUserAndEnableBiometric = async () => {
    if (!password) {
      ToastAndroid.show("Password is required.", ToastAndroid.SHORT);
      return;
    }

    try {
      // Reauthenticate user
      const credential = EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);

      // Check for biometric hardware
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        ToastAndroid.show(
          "Biometric hardware is not available on this device.",
          ToastAndroid.SHORT
        );
        return;
      }

      // Prompt for biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to enable biometric",
        cancelLabel: "Cancel",
        disableDeviceFallback: true,
      });

      if (result.success) {
        // Store credentials securely
        await SecureStore.setItemAsync("biometricEnabled", "true");
        await SecureStore.setItemAsync("userEmail", email);
        await SecureStore.setItemAsync("userPassword", password);

        setBiometricEnabled(true);
        ToastAndroid.show(
          "Biometric authentication enabled",
          ToastAndroid.SHORT
        );
      } else {
        ToastAndroid.show(
          "Biometric authentication failed.",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error(error);
      ToastAndroid.show(
        "Authentication failed. Please check your password.",
        ToastAndroid.SHORT
      );
    } finally {
      setIsModalVisible(false);
      setPassword("");
      Animated.timing(modalTranslateY, {
        toValue: 500,
        duration: 500,
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
        <Text style={{ fontSize: 24, fontFamily: "outfit-bold" }}>Profile</Text>
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
          Enable/ Disable Biometric
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
          Landmark Detection
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
          Language Translator
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
          Logout
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
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                }}
                onPress={verifyUserAndEnableBiometric}
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

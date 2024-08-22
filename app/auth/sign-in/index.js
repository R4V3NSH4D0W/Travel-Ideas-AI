import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Colors } from "../../../constants/Colors";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfig";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import Entypo from "@expo/vector-icons/Entypo";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false); // Renamed from biometricAvailable
  const router = useRouter();

  useEffect(() => {
    const checkBiometricSettings = async () => {
      const biometricPreference = await SecureStore.getItemAsync(
        "biometricEnabled"
      );
      console.log("Biometric Preference:", biometricPreference); // Add logging
      setBiometricEnabled(biometricPreference === "true");

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      console.log("Has Hardware:", hasHardware); // Add logging
      console.log("Is Enrolled:", isEnrolled); // Add logging

      if (!hasHardware || !isEnrolled || !biometricPreference) {
        setBiometricEnabled(false);
      }
    };
    checkBiometricSettings();
  }, []);

  const onSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show("Please enter email and password", ToastAndroid.SHORT);
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);

        ToastAndroid.show("Login successful", ToastAndroid.LONG);

        setTimeout(() => {
          router.replace("/mytrip");
        }, 500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        if (errorCode === "auth/invalid-credential") {
          ToastAndroid.show("Invalid credential", ToastAndroid.LONG);
        } else {
          ToastAndroid.show("Login failed", ToastAndroid.LONG);
        }

        setIsLoading(false);
      });
  };

  const handleBiometricLogin = async () => {
    try {
      // Retrieve stored email and password
      const storedEmail = await SecureStore.getItemAsync("userEmail");
      const storedPassword = await SecureStore.getItemAsync("userPassword");

      if (storedEmail && storedPassword) {
        // Authenticate with biometrics
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Authenticate to log in",
          fallbackLabel: "Use Passcode",
        });

        if (result.success) {
          console.log("Biometric authentication successful");

          // Directly use stored credentials for signing in
          setIsLoading(true);
          signInWithEmailAndPassword(auth, storedEmail, storedPassword)
            .then((userCredential) => {
              const user = userCredential.user;
              console.log(user);

              ToastAndroid.show("Login successful", ToastAndroid.LONG);
              setTimeout(() => {
                router.replace("/mytrip");
              }, 500);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
              if (errorCode === "auth/invalid-credential") {
                ToastAndroid.show("Invalid credential", ToastAndroid.LONG);
              } else {
                ToastAndroid.show("Login failed", ToastAndroid.LONG);
              }

              setIsLoading(false);
            });
        } else {
          ToastAndroid.show(
            "Biometric authentication failed",
            ToastAndroid.LONG
          );
        }
      } else {
        ToastAndroid.show("No credentials stored", ToastAndroid.LONG);
      }
    } catch (error) {
      console.error("Error during biometric login:", error);
      ToastAndroid.show("Biometric authentication failed", ToastAndroid.LONG);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            padding: 25,
            paddingTop: 40,
            backgroundColor: Colors.WHITE,
            height: "100%",
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: "outfit-bold", fontSize: 30, marginTop: 30 }}
          >
            Let's Sign You In
          </Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 20,
              color: Colors.GRAY,
              fontFamily: "outfit-regular",
            }}
          >
            Welcome Back
          </Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              color: Colors.GRAY,
              fontFamily: "outfit-regular",
            }}
          >
            You've been missed
          </Text>
          {/* Email */}
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: "outfit-regular" }}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
            />
          </View>
          {/* Password */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "outfit-regular" }}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={!showPassword}
                style={[styles.passwordInput, { flex: 1 }]}
                placeholder="Enter Password"
                onChangeText={(value) => setPassword(value)}
                value={password}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color={Colors.GRAY}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {/* Sign in Button */}
            <TouchableOpacity
              style={{
                padding: 20,
                marginTop: 20,
                borderRadius: 15,
                width: biometricEnabled ? "80%" : "100%",
                backgroundColor: Colors.PRIMARY,
              }}
              onPress={onSignIn}
            >
              <Text style={{ color: Colors.WHITE, textAlign: "center" }}>
                Sign In
              </Text>
            </TouchableOpacity>

            {/* Biometric Login Button */}
            {biometricEnabled && (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={{
                  padding: 20,
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo name="fingerprint" size={40} color="black" />
              </TouchableOpacity>
            )}
          </View>

          {/* Create Account */}
          <TouchableOpacity
            onPress={() => router.replace("auth/sign-up")}
            style={{
              padding: 20,
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor: Colors.WHITE,
            }}
          >
            <Text style={{ color: Colors.PRIMARY, textAlign: "center" }}>
              Create Account
            </Text>
          </TouchableOpacity>

          {/* Loading Overlay */}
          <Modal
            transparent={true}
            animationType="none"
            visible={isLoading}
            onRequestClose={() => {}}
          >
            <View style={styles.modalBackground}>
              <View style={styles.activityIndicatorWrapper}>
                <ActivityIndicator size="large" color={Colors.PRIMARY} />
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.GRAY,
    padding: 15,
  },
  passwordInput: {
    flex: 1,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  activityIndicatorWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 15,
    width: "80%",
  },
});

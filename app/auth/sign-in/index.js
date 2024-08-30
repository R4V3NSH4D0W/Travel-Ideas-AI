import {
  View,
  Text,
  Modal,
  Keyboard,
  Platform,
  TextInput,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";

import { useRouter } from "expo-router";
import Entypo from "@expo/vector-icons/Entypo";
import * as SecureStore from "expo-secure-store";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as LocalAuthentication from "expo-local-authentication";

import { signInWithEmailAndPassword } from "firebase/auth";

import { Colors } from "../../../constants/Colors";
import { auth } from "../../../configs/FirebaseConfig";
import { TRANSLATE } from "../../i18n/translationHelper";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkBiometricSettings = async () => {
      const biometricPreference = await SecureStore.getItemAsync(
        "biometricEnabled"
      );

      setBiometricEnabled(biometricPreference === "true");

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !isEnrolled || !biometricPreference) {
        setBiometricEnabled(false);
      }
    };
    checkBiometricSettings();
  }, []);

  const onSignIn = () => {
    if (!email || !password) {
      ToastAndroid.show(
        TRANSLATE("AUTH.PLEASE_ENTER_EMAIL_AND_PASSWORD"),
        ToastAndroid.SHORT
      );
      return;
    }

    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        ToastAndroid.show(
          TRANSLATE("AUTH.LOGIN_SUCCESSFUL"),
          ToastAndroid.LONG
        );

        setTimeout(() => {
          router.replace("/mytrip");
        }, 500);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === "auth/invalid-credential") {
          ToastAndroid.show(
            TRANSLATE("AUTH.INVALID_CREDENTIAL"),
            ToastAndroid.LONG
          );
        } else {
          ToastAndroid.show(TRANSLATE("AUTH.LOGIN_FAILED"), ToastAndroid.LONG);
        }

        setIsLoading(false);
      });
  };

  const handleBiometricLogin = async () => {
    try {
      const storedEmail = await SecureStore.getItemAsync("userEmail");
      const storedPassword = await SecureStore.getItemAsync("userPassword");

      if (storedEmail && storedPassword) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: TRANSLATE("AUTH.AUTHENTICATE_TO_LOG_IN"),
          fallbackLabel: TRANSLATE("AUTH.USE_PASSCODE"),
        });

        if (result.success) {
          setIsLoading(true);
          signInWithEmailAndPassword(auth, storedEmail, storedPassword)
            .then((userCredential) => {
              const user = userCredential.user;
              ToastAndroid.show(
                TRANSLATE("AUTH.LOGIN_SUCCESSFUL"),
                ToastAndroid.LONG
              );
              setTimeout(() => {
                router.replace("/mytrip");
              }, 500);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;

              if (errorCode === "auth/invalid-credential") {
                ToastAndroid.show(
                  TRANSLATE("AUTH.INVALID_CREDENTIAL"),
                  ToastAndroid.LONG
                );
              } else {
                ToastAndroid.show(
                  TRANSLATE("AUTH.LOGIN_FAILED"),
                  ToastAndroid.LONG
                );
              }

              setIsLoading(false);
            });
        } else {
          ToastAndroid.show(
            TRANSLATE("AUTH.BIOMETRIC_AUTHENTICATION_FAILED"),
            ToastAndroid.LONG
          );
        }
      } else {
        ToastAndroid.show(
          TRANSLATE("AUTH.NO_CREDENTIALS_STORED"),
          ToastAndroid.LONG
        );
      }
    } catch (error) {
      console.error("Error during biometric login:", error);
      ToastAndroid.show(
        TRANSLATE("AUTH.BIOMETRIC_AUTHENTICATION_FAILED"),
        ToastAndroid.LONG
      );
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
            height: "100%",
            backgroundColor: Colors.WHITE,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text
            style={{ fontFamily: "outfit-bold", fontSize: 30, marginTop: 30 }}
          >
            {TRANSLATE("AUTH.LETS_SIGN_YOU_IN")}
          </Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 20,
              color: Colors.GRAY,
              fontFamily: "outfit-regular",
            }}
          >
            {TRANSLATE("AUTH.WELCOME_BACK")}
          </Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              color: Colors.GRAY,
              fontFamily: "outfit-regular",
            }}
          >
            {TRANSLATE("AUTH.YOUVE_BEEN_MISSED")}
          </Text>
          {/* Email */}
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: "outfit-regular" }}>
              {TRANSLATE("AUTH.EMAIL")}
            </Text>
            <TextInput
              value={email}
              style={styles.input}
              keyboardType="email-address"
              placeholder={TRANSLATE("AUTH.ENTER_EMAIL")}
              onChangeText={(value) => setEmail(value)}
            />
          </View>
          {/* Password */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "outfit-regular" }}>
              {TRANSLATE("AUTH.PASSWORD")}
            </Text>
            <View style={styles.passwordContainer}>
              <TextInput
                secureTextEntry={!showPassword}
                style={[styles.passwordInput, { flex: 1 }]}
                placeholder={TRANSLATE("AUTH.ENTER_PASSWORD")}
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
                backgroundColor: Colors.PRIMARY,
                width: biometricEnabled ? "80%" : "100%",
              }}
              onPress={onSignIn}
            >
              <Text style={{ color: Colors.WHITE, textAlign: "center" }}>
                {TRANSLATE("AUTH.SIGN_IN")}
              </Text>
            </TouchableOpacity>

            {/* Biometric Login Button */}
            {biometricEnabled && (
              <TouchableOpacity
                onPress={handleBiometricLogin}
                style={{
                  padding: 20,
                  marginTop: 20,
                  alignItems: "center",
                  justifyContent: "center",
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
              {TRANSLATE("AUTH.CREATE_ACCOUNT")}
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
    padding: 15,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    borderColor: Colors.GRAY,
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
    padding: 20,
    width: "80%",
    display: "flex",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});

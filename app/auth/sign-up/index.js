import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Modal,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Colors } from "../../../constants/Colors";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../configs/FirebaseConfig";
import { TRANSLATE } from "../../i18n/translationHelper";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validatePassword = (password) => {
  const minLength = 7;
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);
  const hasNumber = /\d/.test(password);

  if (password.length < minLength) {
    return TRANSLATE("AUTH.PASSWORD_TOO_SHORT");
  }
  if (!hasUppercase) {
    return TRANSLATE("AUTH.PASSWORD_NO_UPPERCASE");
  }
  if (!hasSpecialChar) {
    return TRANSLATE("AUTH.PASSWORD_NO_SPECIAL_CHAR");
  }
  if (!hasNumber) {
    return TRANSLATE("AUTH.PASSWORD_NO_NUMBER");
  }
  return "";
};

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const OnCreateAccount = () => {
    if (!email || !password || !fullName) {
      ToastAndroid.show(TRANSLATE("AUTH.ENTER_ALL_DETAILS"), ToastAndroid.LONG);
      return;
    }

    if (!emailRegex.test(email)) {
      ToastAndroid.show(TRANSLATE("AUTH.INVALID_EMAIL"), ToastAndroid.LONG);
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      ToastAndroid.show(passwordError, ToastAndroid.LONG);
      return;
    }

    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        return updateProfile(user, {
          displayName: fullName,
        }).then(() => {
          ToastAndroid.show(
            TRANSLATE("AUTH.ACCOUNT_CREATED"),
            ToastAndroid.SHORT
          );

          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          router.replace("auth/sign-in");
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        if (errorCode === "auth/email-already-in-use") {
          ToastAndroid.show(TRANSLATE("AUTH.EMAIL_IN_USE"), ToastAndroid.LONG);
        } else {
          ToastAndroid.show(errorMessage, ToastAndroid.LONG);
        }

        setIsLoading(false);
      });
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
            paddingTop: 50,
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
            {TRANSLATE("AUTH.CREATE_ACCOUNT")}
          </Text>
          {/* User Full name */}
          <View style={{ marginTop: 50 }}>
            <Text style={{ fontFamily: "outfit-regular" }}>
              {TRANSLATE("AUTH.USER_FULL_NAME")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={TRANSLATE("AUTH.ENTER_FULL_NAME")}
              onChangeText={(value) => setFullName(value)}
              value={fullName}
            />
          </View>

          {/* Email */}
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: "outfit-regular" }}>
              {TRANSLATE("AUTH.EMAIL")}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={TRANSLATE("AUTH.ENTER_EMAIL")}
              onChangeText={(value) => setEmail(value)}
              value={email}
              keyboardType="email-address"
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

          {/* Create Account Button */}
          <TouchableOpacity
            onPress={OnCreateAccount}
            style={{
              padding: 20,
              marginTop: 50,
              borderRadius: 15,
              backgroundColor: Colors.PRIMARY,
            }}
          >
            <Text style={{ color: Colors.WHITE, textAlign: "center" }}>
              {TRANSLATE("AUTH.CREATE_ACCOUNT")}
            </Text>
          </TouchableOpacity>

          {/* Sign up */}
          <TouchableOpacity
            onPress={() => router.replace("auth/sign-in")}
            style={{
              padding: 20,
              marginTop: 20,
              borderWidth: 1,
              borderRadius: 15,
              backgroundColor: Colors.WHITE,
            }}
          >
            <Text style={{ color: Colors.PRIMARY, textAlign: "center" }}>
              {TRANSLATE("AUTH.SIGN_UP")}
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

          {/* Biometric Prompt Modal */}
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
  passwordInput: {
    padding: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 15,
    paddingRight: 10,
    borderColor: Colors.GRAY,
  },
  modalBackground: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicatorWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: Colors.WHITE,
    borderRadius: 15,
    width: "80%",
  },
  modalButton: {
    padding: 15,
    borderRadius: 15,
    backgroundColor: Colors.PRIMARY,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
  },
  modalButtonText: {
    color: Colors.WHITE,
    fontFamily: "outfit-bold",
    fontSize: 16,
  },
});

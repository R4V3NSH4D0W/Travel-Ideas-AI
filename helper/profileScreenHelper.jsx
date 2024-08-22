import {
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
} from "firebase/storage";
import { ToastAndroid } from "react-native";
import { updateProfile } from "firebase/auth";
import { auth } from "../configs/FirebaseConfig";
import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export const uploadImageToFirebase = async (uri) => {
  const user = auth.currentUser;
  const userId = auth.currentUser?.uid;

  if (!userId) return;

  try {
    const fileName = uri.split("/").pop();
    const userImagePath = `profile_pictures/${userId}/${fileName}`;

    if (user.photoURL) {
      const existingImageRef = ref(storage, user.photoURL);
      try {
        await deleteObject(existingImageRef);
      } catch (error) {
        if (error.code !== "storage/object-not-found") {
          console.error("Failed to delete existing image:", error);
        }
      }
    }

    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, userImagePath);
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);

    await updateProfile(user, { photoURL: downloadURL });

    return downloadURL;
  } catch (error) {
    console.error(error);
    ToastAndroid.show("Failed to upload image.", ToastAndroid.SHORT);
    throw error;
  }
};

export const loadBiometricPreference = async () => {
  const storedBiometricPreference = await SecureStore.getItemAsync(
    "biometricEnabled"
  );
  return storedBiometricPreference === "true";
};

export const disableBiometricAuthentication = async () => {
  await SecureStore.deleteItemAsync("biometricEnabled");
  await SecureStore.deleteItemAsync("userEmail");
  await SecureStore.deleteItemAsync("userPassword");
  ToastAndroid.show(
    "Biometric authentication disabled. Please re-enable to set up new credentials.",
    ToastAndroid.SHORT
  );
};

export const verifyUserAndEnableBiometric = async (
  user,
  email,
  password,
  setBiometricEnabled,
  setIsModalVisible,
  setPassword
) => {
  if (!password) {
    ToastAndroid.show("Password is required.", ToastAndroid.SHORT);
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      ToastAndroid.show(
        "Biometric hardware is not available on this device.",
        ToastAndroid.SHORT
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to enable biometric",
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (result.success) {
      await SecureStore.setItemAsync("biometricEnabled", "true");
      await SecureStore.setItemAsync("userEmail", email);
      await SecureStore.setItemAsync("userPassword", password);

      setBiometricEnabled(true);
      ToastAndroid.show("Biometric authentication enabled", ToastAndroid.SHORT);
    } else {
      ToastAndroid.show("Biometric authentication failed.", ToastAndroid.SHORT);
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
  }
};

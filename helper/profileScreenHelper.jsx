import {
  ref,
  listAll,
  deleteObject,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import { ToastAndroid } from "react-native";
import { updateProfile } from "firebase/auth";
import * as SecureStore from "expo-secure-store";
import { auth, storage } from "../configs/FirebaseConfig";
import * as LocalAuthentication from "expo-local-authentication";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

export const uploadImageToFirebase = async (uri) => {
  const user = auth.currentUser;
  const userId = auth.currentUser?.uid;

  if (!userId) return;

  try {
    const fileName = uri.split("/").pop();
    const imagePath = `profile_pictures/${userId}/`;
    const imageRef = ref(storage, imagePath);

    try {
      const listResult = await listAll(imageRef);
      const deletePromises = listResult.items.map((itemRef) =>
        deleteObject(itemRef)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Failed to delete existing images:", error);
    }

    const fetchResponse = await fetch(uri);
    const blob = await fetchResponse.blob();

    const uploadTask = uploadBytesResumable(
      ref(storage, `${imagePath}${fileName}`),
      blob
    );

    uploadTask.on(
      "state_changed",
      null,
      (error) => {
        console.error("Error uploading image:", error);
        ToastAndroid.show("Failed to upload image.", ToastAndroid.SHORT);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });

          return downloadURL;
        } catch (error) {
          ToastAndroid.show("Failed to fetch image URL.", ToastAndroid.SHORT);
          throw error;
        }
      }
    );
  } catch (error) {
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

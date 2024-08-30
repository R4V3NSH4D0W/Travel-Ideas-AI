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
import * as LocalAuthentication from "expo-local-authentication";

import { auth, storage } from "../configs/FirebaseConfig";
import { TRANSLATE } from "../app/i18n/translationHelper";
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
        ToastAndroid.show(
          TRANSLATE("MESSAGES.FAILED_TO_UPLOAD_IMAGE"),
          ToastAndroid.SHORT
        );
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });

          return downloadURL;
        } catch (error) {
          ToastAndroid.show(
            TRANSLATE("MESSAGES.FAILED_TO_FETCH_IMAGE_URL"),
            ToastAndroid.SHORT
          );
          throw error;
        }
      }
    );
  } catch (error) {
    ToastAndroid.show(
      TRANSLATE("MESSAGES.FAILED_TO_UPLOAD_IMAGE"),
      ToastAndroid.SHORT
    );
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
    TRANSLATE("MESSAGES.BIOMETRIC_AUTHENTICATION_DISABLED"),
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
    ToastAndroid.show(
      TRANSLATE("MESSAGES.PASSWORD_IS_REQUIRED"),
      ToastAndroid.SHORT
    );
    return;
  }

  try {
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      ToastAndroid.show(
        TRANSLATE("MESSAGES.BIOMETRIC_HARDWARE_NOT_AVAILABLE"),
        ToastAndroid.SHORT
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: TRANSLATE("MESSAGES.AUTHENTICATE_TO_ENABLE_BIOMETRIC"),
      cancelLabel: "Cancel",
      disableDeviceFallback: true,
    });

    if (result.success) {
      await SecureStore.setItemAsync("biometricEnabled", "true");
      await SecureStore.setItemAsync("userEmail", email);
      await SecureStore.setItemAsync("userPassword", password);

      setBiometricEnabled(true);
      ToastAndroid.show(
        TRANSLATE("MESSAGES.BIOMETRIC_ENABLED"),
        ToastAndroid.SHORT
      );
    } else {
      ToastAndroid.show(
        TRANSLATE("MESSAGES.BIOMETRIC_AUTHENTICATION_DISABLED"),
        ToastAndroid.SHORT
      );
    }
  } catch (error) {
    console.error(error);
    ToastAndroid.show(
      TRANSLATE("MESSAGES.AUTHENTICATION_FAILED_CHECK_PASSWORD"),

      ToastAndroid.SHORT
    );
  } finally {
    setIsModalVisible(false);
    setPassword("");
  }
};

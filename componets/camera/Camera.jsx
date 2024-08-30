import { View, Alert, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState, useEffect, useRef } from "react";

import Entypo from "@expo/vector-icons/Entypo";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { Camera, CameraType } from "expo-camera/legacy";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { Colors } from "../../constants/Colors";

const AACamera = ({ onImageCaptured }) => {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [ratio, setRatio] = useState("4:3");
  const [isCameraReady, setIsCameraReady] = useState(false);

  const cameraRef = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      Alert.alert(
        "Camera Permission Required",
        "We need your permission to show the camera",
        [
          {
            text: "Grant Permission",
            onPress: () => requestPermission(),
          },
        ],
        { cancelable: false }
      );
    }
  }, [permission]);

  const onCameraReady = async () => {
    setIsCameraReady(true);
    if (cameraRef.current) {
      const supportedRatios = await cameraRef.current.getSupportedRatiosAsync();
      if (supportedRatios.includes("3:4")) {
        setRatio("3:4");
      } else {
        setRatio(supportedRatios[0]);
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: true,
      });
      onImageCaptured(photo.uri, photo.base64);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      onImageCaptured(imageUri, base64);
    }
  };

  const toggleCameraType = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  return (
    <View style={styles.container}>
      <Camera
        type={type}
        ratio={ratio}
        ref={cameraRef}
        style={styles.camera}
        onCameraReady={onCameraReady}
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Entypo name="image" size={34} color={Colors.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              { borderWidth: 5, borderColor: Colors.WHITE },
            ]}
            onPress={takePicture}
          >
            <FontAwesome name="search" size={28} color={Colors.WHITE} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <MaterialCommunityIcons
              size={34}
              name="camera-flip"
              color={Colors.WHITE}
            />
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

export default AACamera;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonContainer: {
    marginBottom: 40,
    flexDirection: "row",
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  button: {
    width: 70,
    height: 70,
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(211, 211, 211, 0.5)",
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});

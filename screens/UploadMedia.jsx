import React from "react";
import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { VESDK } from "react-native-videoeditorsdk";
import * as ImagePicker from "expo-image-picker";

export default function UploadMedia() {
  const openCamera = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to capture videos."
        );
        return;
      }

      // Launch the camera
      const pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });

      // Return if the video capture was cancelled
      if (pickerResult.cancelled) {
        Alert.alert("Cancelled", "No video was captured.");
        return;
      }

      // Open the video editor with the captured video
      const result = await VESDK.openEditor(pickerResult.uri);

      if (result != null) {
        // The user exported a new video successfully
        Alert.alert("Video Exported", `Video saved at: ${result.video}`);
        console.log("Exported video path:", result.video);
      } else {
        // The user tapped on the cancel button within the editor
        Alert.alert("Cancelled", "Video editing was cancelled.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while capturing or editing the video."
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Capture and Edit Media</Text>
      <Button title="Open Camera" onPress={openCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

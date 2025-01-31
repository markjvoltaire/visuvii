import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

export default function UploadImage({ navigation }) {
  const [image, setImage] = useState(null);

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to capture videos."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
        console.log("Image captured:", result.assets[0].uri);
      } else {
        console.log("No image selected or capture canceled");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.retakeButton} onPress={openCamera}>
              <MaterialIcons name="replay" size={24} color="white" />
              <Text style={styles.retakeButtonText}>Retake Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.placeholderContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
              <MaterialIcons name="camera-alt" size={40} color="#2196F3" />
              <Text style={styles.uploadText}>Take a Photo</Text>
              <Text style={styles.uploadSubText}>
                Tap here to capture an image
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        {image && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => {
              // Handle the continue action here
              console.log("HELLO");
            }}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderStyle: "dashed",
    width: "100%",
    aspectRatio: 4 / 3,
  },
  uploadText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2196F3",
    marginTop: 15,
  },
  uploadSubText: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  retakeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
  },
  retakeButtonText: {
    color: "white",
    marginLeft: 5,
    fontSize: 14,
  },
  footer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  continueButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

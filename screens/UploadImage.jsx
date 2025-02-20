import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { supabase } from "../services/supabase";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/debru0cpu/image/upload";
const UPLOAD_PRESET = "TizlyUpload";

export default function UploadImage({ navigation, route }) {
  const { item } = route.params;

  const [imageData, setImageData] = useState({
    uri: null,
    details: null,
  });
  const [accepted, setAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    if (!imageData.uri) {
      Alert.alert("Error", "Please take a photo before proceeding.");
      return false;
    }
    if (!accepted) {
      Alert.alert("Error", "Please accept the terms and conditions.");
      return false;
    }
    return true;
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera access to take photos"
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const handleImageCapture = async (result) => {
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const fileExtension = asset.uri.split(".").pop();

      const newImageData = {
        uri: asset.uri,
        details: {
          uri: asset.uri,
          type: `image/${fileExtension}`,
          name: `image.${fileExtension}`,
        },
      };

      setImageData(newImageData);
      return true;
    }
    return false;
  };

  const openCamera = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
      });

      await handleImageCapture(result);
    } catch (error) {
      Alert.alert("Camera Error", "Failed to open camera. Please try again.");
      console.error("Camera error:", error);
    }
  };

  const uploadToCloudinary = async () => {
    if (!imageData.details) {
      throw new Error("No image data available");
    }

    const formData = new FormData();
    formData.append("file", imageData.details);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      return data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload image to Cloudinary");
    }
  };

  const createTournamentEntry = async (mediaUrl) => {
    const userId = supabase.auth.currentUser?.id;
    if (!userId) {
      throw new Error("Authentication required");
    }

    const { error } = await supabase.from("entries").insert([
      {
        creatorId: item.creatorId,
        entryPrice: item.entryPrice,
        mediaType: item.mediaType,
        media: mediaUrl,
        userId: userId,
        tournamentId: item.tournamentId,
        category: item.category,
      },
    ]);

    if (error) throw error;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    try {
      setIsUploading(true);

      // Step 1: Upload to Cloudinary
      const mediaUrl = await uploadToCloudinary();

      // Step 2: Create tournament entry with media URL
      await createTournamentEntry(mediaUrl);

      Alert.alert("Success", "You have entered this tournament!", [
        { text: "OK", onPress: () => navigation.navigate("Tournaments") },
      ]);
    } catch (error) {
      console.error("Upload/Creation error:", error);
      Alert.alert("Error", "Failed to create tournament. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const ImagePreview = () => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: imageData.uri }} style={styles.image} />
      <TouchableOpacity style={styles.retakeButton} onPress={openCamera}>
        <MaterialIcons name="replay" size={24} color="white" />
        <Text style={styles.retakeButtonText}>Retake Photo</Text>
      </TouchableOpacity>
    </View>
  );

  const CameraButton = () => (
    <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
      <MaterialIcons name="camera-alt" size={40} color="#2196F3" />
      <Text style={styles.uploadText}>Take a Photo</Text>
      <Text style={styles.uploadSubText}>Tap here to capture an image</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isUploading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={styles.loadingText}>Joining Tournament...</Text>
          </View>
        </View>
      )}

      <View style={styles.content}>
        {imageData.uri ? (
          <ImagePreview />
        ) : (
          <View style={styles.placeholderContainer}>
            <CameraButton />
          </View>
        )}
      </View>

      <View style={styles.termsContainer}>
        <Text style={styles.termsText}>
          I acknowledge that the content I upload is my own, and I am solely
          responsible for it. I agree to the terms and conditions, including any
          legal liabilities that may arise from my content.
        </Text>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            accessibilityLabel="Accept terms and agreement"
            accessibilityRole="checkbox"
            style={[
              styles.checkbox,
              { backgroundColor: accepted ? "#2196F3" : "transparent" },
            ]}
            onPress={() => setAccepted(!accepted)}
          >
            {accepted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>I accept terms and agreement</Text>
        </View>
      </View>

      <View style={styles.footer}>
        {imageData.uri && (
          <TouchableOpacity
            style={[
              styles.continueButton,
              !accepted && styles.continueButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={!accepted || isUploading}
          >
            <Text style={styles.continueButtonText}>
              {isUploading ? "Uploading" : "Enter Tournament"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// Styles remain unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  termsContainer: {
    padding: 20,
    backgroundColor: "#fff",
  },
  termsText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
    lineHeight: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#2196F3",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
    color: "#333",
    flex: 1,
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
  continueButtonDisabled: {
    backgroundColor: "#ccc",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

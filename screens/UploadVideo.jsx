import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useRef } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { supabase } from "../services/supabase";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/debru0cpu/video/upload";
const UPLOAD_PRESET = "TizlyUpload";
const MAX_DURATION = 60; // Maximum video duration in seconds

export default function UploadVideo({ navigation, route }) {
  const { item } = route.params;
  const videoRef = useRef(null);

  const [videoData, setVideoData] = useState({
    uri: null,
    details: null,
  });
  const [accepted, setAccepted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const validateForm = () => {
    if (!videoData.uri) {
      Alert.alert("Error", "Please record a video before proceeding.");
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
          "Please grant camera access to record videos"
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Permission error:", error);
      return false;
    }
  };

  const handleVideoCapture = async (result) => {
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      const fileExtension = asset.uri.split(".").pop();

      const newVideoData = {
        uri: asset.uri,
        details: {
          uri: asset.uri,
          type: `video/${fileExtension}`,
          name: `video.${fileExtension}`,
        },
      };

      setVideoData(newVideoData);
      return true;
    }
    return false;
  };

  const openCamera = async () => {
    try {
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) return;

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        videoMaxDuration: MAX_DURATION,
        quality: 1,
      });

      await handleVideoCapture(result);
    } catch (error) {
      Alert.alert("Camera Error", "Failed to open camera. Please try again.");
      console.error("Camera error:", error);
    }
  };

  const uploadToCloudinary = async () => {
    if (!videoData.details) {
      throw new Error("No video data available");
    }

    const formData = new FormData();
    formData.append("file", videoData.details);
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
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      throw new Error("Failed to upload video to Cloudinary");
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
      },
    ]);

    if (error) throw error;
  };

  const handleUpload = async () => {
    if (!validateForm()) return;

    try {
      setIsUploading(true);
      const mediaUrl = await uploadToCloudinary();
      await createTournamentEntry(mediaUrl);

      Alert.alert("Success", "You have entered this tournament!", [
        { text: "OK", onPress: navigation.navigate("Tournaments") },
      ]);
    } catch (error) {
      console.error("Upload/Creation error:", error);
      Alert.alert("Error", "Failed to create tournament. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const VideoPreview = () => (
    <View style={styles.videoContainer}>
      <Video
        ref={videoRef}
        source={{ uri: videoData.uri }}
        style={styles.video}
        useNativeControls
        resizeMode="contain"
        isLooping
      />
      <TouchableOpacity style={styles.retakeButton} onPress={openCamera}>
        <MaterialIcons name="replay" size={24} color="white" />
        <Text style={styles.retakeButtonText}>Record Again</Text>
      </TouchableOpacity>
    </View>
  );

  const RecordButton = () => (
    <TouchableOpacity style={styles.uploadButton} onPress={openCamera}>
      <MaterialIcons name="videocam" size={40} color="#2196F3" />
      <Text style={styles.uploadText}>Record Video</Text>
      <Text style={styles.uploadSubText}>Tap here to start recording</Text>
      <Text style={styles.durationText}>
        Maximum duration: {MAX_DURATION} seconds
      </Text>
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
        {videoData.uri ? (
          <VideoPreview />
        ) : (
          <View style={styles.placeholderContainer}>
            <RecordButton />
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
        {videoData.uri && (
          <TouchableOpacity
            style={[
              styles.continueButton,
              !accepted && styles.continueButtonDisabled,
            ]}
            onPress={handleUpload}
            disabled={!accepted || isUploading}
          >
            <Text style={styles.continueButtonText}>
              {isUploading ? "Joining..." : "Enter Tournament"}
            </Text>
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
    aspectRatio: 16 / 9,
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
  durationText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  videoContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "black",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  video: {
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

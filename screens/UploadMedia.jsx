import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  SafeAreaView,
  Image,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function UploadImage() {
  const [image, setImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const openCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Camera access is required to capture photos."
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
        setShowPreview(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open camera: " + error.message);
    }
  };

  const handleRetake = () => {
    setImage(null);
    setShowPreview(false);
  };

  const handleSubmit = () => {
    Alert.alert("Submit Image", "Are you sure you want to submit this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Submit",
        onPress: () => {
          Alert.alert("Success", "Image submitted successfully!");
          setImage(null);
          setShowPreview(false);
        },
      },
    ]);
  };

  const renderPreview = () => (
    <Modal
      animationType="slide"
      transparent={false}
      visible={showPreview}
      onRequestClose={() => setShowPreview(false)}
    >
      <SafeAreaView style={styles.previewContainer}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Image Preview</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPreview(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: image }}
            style={styles.media}
            resizeMode="contain"
          />
        </View>

        <View style={styles.previewActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.retakeButton]}
            onPress={handleRetake}
          >
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={[styles.actionButtonText, styles.submitButtonText]}>
              Submit
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Upload Image</Text>
        <Text style={styles.subtitle}>Take a clear photo</Text>

        <View style={styles.captureSection}>
          <Pressable
            onPress={openCamera}
            style={({ pressed }) => [
              styles.captureButton,
              pressed && styles.captureButtonPressed,
            ]}
          >
            <MaterialIcons
              name="camera-alt"
              size={40}
              color="#FFFFFF"
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Capture</Text>
          </Pressable>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>Photo Guidelines!</Text>
          <View style={styles.guidelinesList}>
            <Text style={styles.guidelineItem}>• Ensure good lighting</Text>
            <Text style={styles.guidelineItem}>• Keep device steady</Text>
            <Text style={styles.guidelineItem}>• Frame your subject well</Text>
            <Text style={styles.guidelineItem}>• Avoid blurry shots</Text>
          </View>
        </View>
      </View>

      {renderPreview()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
  },
  captureSection: {
    marginBottom: 32,
    alignItems: "center",
  },
  captureButton: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
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
  captureButtonPressed: {
    backgroundColor: "#4338CA",
  },
  buttonIcon: {
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  infoSection: {
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 16,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 12,
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    fontSize: 14,
    lineHeight: 22,
    color: "#4F46E5",
    opacity: 0.8,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#111827",
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mediaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  media: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * (4 / 3),
  },
  previewActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#111827",
  },
  actionButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  retakeButton: {
    backgroundColor: "#374151",
  },
  submitButton: {
    backgroundColor: "#4F46E5",
  },
});

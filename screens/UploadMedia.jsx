import { CameraView, useCameraPermissions } from "expo-camera";
import { useState, useRef } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("back");
  const [media, setMedia] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const cameraRef = useRef(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to use the camera
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // Function to toggle the camera direction
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  // Function to capture an image
  const takePicture = async () => {
    if (cameraRef.current && !isRecording) {
      const photo = await cameraRef.current.takePictureAsync({
        mirror: facing === "front",
      });
      setMedia({ uri: photo.uri, type: "image" });
    }
  };

  // Function to start recording a video
  const startRecording = async () => {
    if (cameraRef.current) {
      setIsRecording(true);
      const video = await cameraRef.current.recordAsync({
        mirror: facing === "front",
      });
      setMedia({ uri: video.uri, type: "video" });
      setIsRecording(false);
    }
  };

  // Function to stop recording
  const stopRecording = () => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  };

  // Function to reset the captured media
  const resetMedia = () => {
    setMedia(null);
  };

  return (
    <View style={styles.container}>
      {!media ? (
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>

            {/* Capture Button */}
            <TouchableOpacity
              style={[
                styles.captureButton,
                isRecording ? styles.recordingButton : null,
              ]}
              onPress={takePicture}
              onLongPress={startRecording}
              onPressOut={stopRecording}
            />
          </View>
        </CameraView>
      ) : (
        <View style={styles.previewContainer}>
          {media.type === "image" ? (
            <Image source={{ uri: media.uri }} style={styles.previewImage} />
          ) : (
            <Video
              source={{ uri: media.uri }}
              style={styles.previewImage}
              useNativeControls
              resizeMode="contain"
            />
          )}
          <TouchableOpacity style={styles.closeButton} onPress={resetMedia}>
            <Text style={styles.text}>Retake</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  controls: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: "white",
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "gray",
  },
  recordingButton: {
    backgroundColor: "red",
    borderColor: "darkred",
  },
  flipButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 20,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  closeButton: {
    position: "absolute",
    bottom: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 15,
    borderRadius: 10,
  },
});

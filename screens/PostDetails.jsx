import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Animated,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Video } from "expo-av";

export default function PostDetails({ route }) {
  const { entry } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleMediaLoad = () => {
    setIsLoading(false);
    startFadeAnimation();
  };

  const startFadeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setIsLoading(true);
    fadeAnim.setValue(0);
  }, [entry]);

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const MediaContent = () => {
    if (entry.mediaType === "video") {
      return (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: entry.media }}
            style={styles.backgroundVideo}
            resizeMode="contain"
            shouldPlay={true}
            isLooping={true}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => {
              setIsLoading(false);
              startFadeAnimation();
            }}
          />
        </View>
      );
    }

    return (
      <Animated.Image
        style={[styles.backgroundImage, { opacity: fadeAnim }]}
        source={{ uri: entry.media }}
        onLoad={handleMediaLoad}
      />
    );
  };

  return (
    <View style={styles.container}>
      <MediaContent />

      <View
        style={[styles.overlay, { height: screenHeight, width: screenWidth }]}
      />

      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => console.log("Voted down")}
        >
          <Image
            style={styles.voteIcon}
            source={require("../assets/voteDown.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => console.log("Voted up")}
        >
          <Image
            style={styles.voteIcon}
            source={require("../assets/voteUp.png")}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute",
  },
  videoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVideo: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  playPauseButton: {
    position: "absolute",
    zIndex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 40,
  },
  overlay: {
    position: "absolute",
    backgroundColor: "black",
    opacity: 0.3,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  voteButton: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  voteIcon: {
    height: 70,
    width: 70,
    resizeMode: "contain",
  },
});

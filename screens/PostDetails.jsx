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

export default function PostDetails({ route }) {
  const { image } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
    startFadeAnimation();
  };

  // Start fade animation
  const startFadeAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  };

  // Reset animation when image changes
  useEffect(() => {
    setIsLoading(true);
    fadeAnim.setValue(0);
  }, [image]);

  return (
    <View style={styles.container}>
      {/* Fading Background Image */}
      <Animated.Image
        style={[styles.backgroundImage, { opacity: fadeAnim }]}
        source={image}
        onLoad={handleImageLoad}
      />

      {/* Dark Overlay */}
      <View
        style={[styles.overlay, { height: screenHeight, width: screenWidth }]}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      )}

      {/* Vote Buttons Container */}
      <View style={styles.buttonsContainer}>
        {/* Thumbs Down Button */}
        <TouchableOpacity
          style={styles.voteButton}
          onPress={() => console.log("Voted down")}
        >
          <Image
            style={styles.voteIcon}
            source={require("../assets/voteDown.png")}
          />
        </TouchableOpacity>

        {/* Thumbs Up Button */}
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
    padding: 10, // Added padding for better touch area
  },
  voteIcon: {
    height: 70,
    width: 70,
    resizeMode: "contain",
  },
});

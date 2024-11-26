import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Animated,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";

export default function PostDetails({ route }) {
  const { image } = route.params; // Extract image from route params

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity is 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, // Fade to opacity 1
      duration: 600, // Duration in milliseconds
      useNativeDriver: true, // Use native driver for performance
    }).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      {/* Fading Background Image */}
      <Animated.Image
        style={[
          styles.backgroundImage,
          { opacity: fadeAnim }, // Bind opacity to fadeAnim
        ]}
        source={image} // Directly use the `require` object
      />
      <View
        style={{
          backgroundColor: "black",
          height: screenHeight,
          width: screenWidth,
          opacity: 0.3,
        }}
      />

      {/* Thumbs Down Icon */}
      <TouchableOpacity style={styles.voteDownButton}>
        <Image
          style={styles.voteIcon}
          source={require("../assets/voteDown.png")}
        />
      </TouchableOpacity>

      {/* Thumbs Up Icon */}
      <TouchableOpacity style={styles.voteUpButton}>
        <Image
          style={styles.voteIcon}
          source={require("../assets/voteUp.png")}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  backgroundImage: {
    height: "100%",
    width: "100%",
    position: "absolute", // Ensure it stays in the background
  },
  voteDownButton: {
    position: "absolute",
    bottom: 50,
    left: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  voteUpButton: {
    position: "absolute",
    bottom: 50,
    right: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  voteIcon: {
    height: 70,
    width: 70,
    resizeMode: "contain", // Maintain aspect ratio
  },
});

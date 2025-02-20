import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Animated,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  Alert,
} from "react-native";
import { Video } from "expo-av";
import { supabase } from "../services/supabase";

export default function PostDetails({ route }) {
  const { entry } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  const videoRef = useRef(null);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  // For fade-in animation on media
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset states on entry change
    setIsLoading(true);
    fadeAnim.setValue(0);
    setHasVoted(false);

    // Check if user has already voted for this entry
    checkIfUserHasVoted();
  }, [entry]);

  const checkIfUserHasVoted = async () => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) return;

      // Fetch any existing vote for this user/entry combination
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("voterId", userId)
        .eq("tournamentId", entry.tournamentId)
        .eq("creatorId", entry.creatorId);

      if (error) throw error;

      // If data array is not empty, user has already voted
      if (data && data.length > 0) {
        setHasVoted(true);
      }
    } catch (err) {
      console.error("Error checking vote:", err);
    }
  };

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

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      await videoRef.current.pauseAsync();
    } else {
      await videoRef.current.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Actual Supabase insertion for "up" vote
   */
  const voteUp = async () => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) {
        throw new Error("Authentication required");
      }

      const { error } = await supabase.from("votes").insert([
        {
          voterId: userId,
          tournamentId: entry.tournamentId,
          creatorId: entry.creatorId,
          voteResult: "up",
        },
      ]);

      if (error) throw error;

      // After a successful vote, disable the buttons
      setHasVoted(true);
    } catch (err) {
      console.error("Error voting up:", err);
    }
  };

  /**
   * Actual Supabase insertion for "down" vote
   */
  const voteDown = async () => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) {
        throw new Error("Authentication required");
      }

      const { error } = await supabase.from("votes").insert([
        {
          voterId: userId,
          tournamentId: entry.tournamentId,
          creatorId: entry.creatorId,
          voteResult: "down",
        },
      ]);

      if (error) throw error;

      // After a successful vote, disable the buttons
      setHasVoted(true);
    } catch (err) {
      console.error("Error voting down:", err);
    }
  };

  /**
   * Show an alert to confirm voteUp
   */
  const handleVoteUpPress = () => {
    if (!hasVoted) {
      Alert.alert(
        "Confirm Vote",
        "Are you sure you want to vote up?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: voteUp, // Call the actual vote function
          },
        ],
        { cancelable: true }
      );
    }
  };

  /**
   * Show an alert to confirm voteDown
   */
  const handleVoteDownPress = () => {
    if (!hasVoted) {
      Alert.alert(
        "Confirm Vote",
        "Are you sure you want to vote down?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Confirm",
            onPress: voteDown, // Call the actual vote function
          },
        ],
        { cancelable: true }
      );
    }
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

      {/* Optionally show a small text if user has voted */}
      {hasVoted && (
        <View style={styles.alreadyVotedContainer}>
          <Text style={styles.alreadyVotedText}>You have already voted</Text>
        </View>
      )}

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.voteButton, hasVoted && styles.voteButtonDisabled]}
          onPress={handleVoteDownPress}
          disabled={hasVoted}
        >
          <Image
            style={styles.voteIcon}
            source={require("../assets/voteDown.png")}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.voteButton, hasVoted && styles.voteButtonDisabled]}
          onPress={handleVoteUpPress}
          disabled={hasVoted}
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
  voteButtonDisabled: {
    opacity: 0.5, // visually indicate disabled
  },
  voteIcon: {
    height: 70,
    width: 70,
    resizeMode: "contain",
  },
  alreadyVotedContainer: {
    position: "absolute",
    top: 100,
    alignSelf: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  alreadyVotedText: {
    color: "#fff",
    fontSize: 16,
  },
});

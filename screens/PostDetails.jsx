import React, { useEffect, useRef, useState, useCallback } from "react";
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

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PostDetails({ route }) {
  const { entry } = route.params;

  // State for media loading, votes, and tournament
  const [isLoading, setIsLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);
  const [upVotes, setUpVotes] = useState(0);
  const [downVotes, setDownVotes] = useState(0);
  const [tournament, setTournament] = useState(null);
  const [tournamentEntries, setTournamentEntries] = useState([]);

  // New state: Creator profile from the "profiles" table
  const [creatorProfile, setCreatorProfile] = useState(null);

  console.log("creatorProfile :>> ", creatorProfile);

  const videoRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fade in animation for media
  const startFadeAnimation = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  // Fetch tournament details
  const fetchTournament = useCallback(async (tournamentId) => {
    try {
      const { data, error } = await supabase
        .from("tournaments")
        .select("*")
        .eq("tournamentId", tournamentId)
        .single();
      if (error) throw error;
      setTournament(data);
    } catch (err) {
      console.error("Error fetching tournament:", err);
    }
  }, []);

  // Fetch all entries with the same tournamentId
  const fetchTournamentEntries = useCallback(async (tournamentId) => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .eq("tournamentId", tournamentId);

      if (error) throw error;

      setTournamentEntries(data || []);
    } catch (err) {
      console.error("Error fetching tournament entries:", err);
      setTournamentEntries([]);
    }
  }, []);

  // Fetch vote counts for the tournament
  const fetchVoteCounts = useCallback(async (tournamentId) => {
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("tournamentId", tournamentId);
      if (error) throw error;
      if (data) {
        setUpVotes(data.filter((v) => v.voteResult === "up").length);
        setDownVotes(data.filter((v) => v.voteResult === "down").length);
      }
    } catch (err) {
      console.error("Error fetching vote counts:", err);
    }
  }, []);

  // Check if the user has already voted
  const checkIfUserHasVoted = useCallback(async (tournamentId, creatorId) => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) return;
      const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("voterId", userId)
        .eq("tournamentId", tournamentId)
        .eq("creatorId", creatorId);
      if (error) throw error;
      setHasVoted(data && data.length > 0);
    } catch (err) {
      console.error("Error checking vote:", err);
    }
  }, []);

  // Fetch the creator's profile based on creatorId from the profiles table
  const fetchCreatorProfile = useCallback(async (creatorId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", creatorId) // Updated column name
        .single();
      if (error) throw error;
      setCreatorProfile(data);
    } catch (err) {
      console.error("Error fetching creator profile:", err);
    }
  }, []);

  // Load data when the entry changes
  useEffect(() => {
    if (!entry) return;
    setIsLoading(true);
    fadeAnim.setValue(0);
    fetchTournament(entry.tournamentId);
    fetchVoteCounts(entry.tournamentId);
    checkIfUserHasVoted(entry.tournamentId, entry.creatorId);
    fetchCreatorProfile(entry.creatorId);
    fetchTournamentEntries(entry.tournamentId);
    setIsLoading(false);
  }, [
    entry,
    fadeAnim,
    fetchTournament,
    fetchVoteCounts,
    checkIfUserHasVoted,
    fetchCreatorProfile,
    fetchTournamentEntries,
  ]);

  // Media load handler
  const handleMediaLoad = useCallback(() => {
    setIsLoading(false);
    startFadeAnimation();
  }, [startFadeAnimation]);

  // Vote function
  const handleVote = useCallback(
    async (voteResult) => {
      try {
        const userId = supabase.auth.currentUser?.id;
        if (!userId) throw new Error("Authentication required");
        const { error } = await supabase.from("votes").insert([
          {
            voterId: userId,
            tournamentId: entry.tournamentId,
            creatorId: entry.creatorId,
            voteResult,
          },
        ]);
        if (error) throw error;
        voteResult === "up"
          ? setUpVotes((prev) => prev + 1)
          : setDownVotes((prev) => prev + 1);
        setHasVoted(true);
      } catch (err) {
        console.error(`Error voting ${voteResult}:`, err);
      }
    },
    [entry]
  );

  const confirmVote = useCallback(
    (voteResult) => {
      if (!hasVoted) {
        Alert.alert(
          "Confirm Vote",
          `Are you sure you want to vote ${voteResult}?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Confirm", onPress: () => handleVote(voteResult) },
          ],
          { cancelable: true }
        );
      }
    },
    [hasVoted, handleVote]
  );

  // Media component for image or video
  const MediaContent = () => {
    if (entry?.mediaType === "video") {
      return (
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: entry.media }}
            style={styles.backgroundVideo}
            resizeMode="contain"
            shouldPlay
            isLooping
            onLoadStart={() => setIsLoading(true)}
            onLoad={handleMediaLoad}
          />
        </View>
      );
    }
    return (
      <Animated.Image
        style={[styles.backgroundImage, { opacity: fadeAnim }]}
        source={{ uri: entry?.media }}
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

      {/* Bottom info and control bar */}
      <View style={styles.bottomContainer}>
        {/* User profile section */}
        {hasVoted && creatorProfile && (
          <View style={styles.userInfoContainer}>
            <View style={styles.userLeftContainer}>
              <Image
                source={{ uri: creatorProfile.profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.userTextContainer}>
                <Text style={styles.usernameText}>
                  {creatorProfile.username}
                </Text>
                {tournament && (
                  <Text style={styles.subInfoText}>
                    Total Pot: ${tournament.prize || "0"}
                  </Text>
                )}
              </View>
            </View>

            {/* Users joined count on right side */}
            {tournamentEntries && (
              <View style={styles.joinedCountContainer}>
                <Text style={styles.joinedCountText}>
                  {tournamentEntries.length} / {tournament?.entriesSize || 0}{" "}
                  joined
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Vote buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.voteButton, styles.upCircle]}
            onPress={() => confirmVote("up")}
            disabled={hasVoted}
          >
            {!hasVoted ? (
              <Image
                style={styles.voteIcon}
                source={require("../assets/voteUp.png")}
              />
            ) : (
              <Text style={styles.voteCountText}>{upVotes}</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteButton, styles.downCircle]}
            onPress={() => confirmVote("down")}
            disabled={hasVoted}
          >
            {!hasVoted ? (
              <Image
                style={styles.voteIcon}
                source={require("../assets/voteDown.png")}
              />
            ) : (
              <Text style={styles.voteCountText}>{downVotes}</Text>
            )}
          </TouchableOpacity>
        </View>
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
    width: screenWidth,
    height: screenHeight,
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
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 50, // Add extra padding for bottom safe area
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  userLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  userTextContainer: {
    flexDirection: "column",
  },
  usernameText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subInfoText: {
    color: "#fff",
    fontSize: 16,
  },
  joinedCountContainer: {
    alignItems: "flex-end",
  },
  joinedCountText: {
    color: "#fff",
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Changed from space-evenly to match the image
    marginTop: 10,
  },
  voteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  upCircle: {
    backgroundColor: "#00cc66",
  },
  downCircle: {
    backgroundColor: "#ff3333",
  },
  voteIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  voteCountText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

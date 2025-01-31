import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Animated,
  Pressable,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from "react-native";
import { Video } from "expo-av";
import { supabase } from "../services/supabase";

export default function Home({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  const numColumns = 3;
  const spacing = 2;
  const imageSize =
    (Dimensions.get("window").width - spacing * (numColumns + 1)) / numColumns;

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("entries")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setEntries(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching entries:", err);
      setError("Failed to load entries");
      Alert.alert("Error", "Failed to load entries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  // Split entries into columns
  const columnOneEntries = entries.filter((_, index) => index % 3 === 0);
  const columnTwoEntries = entries.filter((_, index) => index % 3 === 1);
  const columnThreeEntries = entries.filter((_, index) => index % 3 === 2);

  const MediaItem = ({ entry, style, onPress }) => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);
    const [isVideoReady, setIsVideoReady] = useState(false);

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{ scale: scaleAnim }],
    };

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.View style={[style, animatedStyle]}>
          {entry.mediaType === "video" ? (
            <View style={[style, styles.videoContainer]}>
              <Video
                source={{ uri: entry.media }}
                style={[StyleSheet.absoluteFill]}
                resizeMode="cover"
                shouldPlay={false}
                isMuted={true}
                useNativeControls={false}
              />
            </View>
          ) : (
            <Image
              source={{ uri: entry.media }}
              style={[style, { width: "100%", height: "100%" }]}
            />
          )}
        </Animated.View>
      </Pressable>
    );
  };

  const renderColumn = (columnEntries) => (
    <View style={styles.column}>
      {loading
        ? Array.from({ length: 5 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.skeleton,
                styles.shimmer,
                { width: imageSize, height: imageSize, margin: spacing },
              ]}
            />
          ))
        : columnEntries.map((entry) => (
            <MediaItem
              key={entry.id}
              entry={entry}
              style={[
                styles.mediaItem,
                { width: imageSize, height: imageSize, margin: spacing },
              ]}
              onPress={() => navigation.navigate("PostDetails", { entry })}
            />
          ))}
    </View>
  );

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchEntries}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="grey"
          />
        }
      >
        <View style={styles.container}>
          {renderColumn(columnOneEntries)}
          {renderColumn(columnTwoEntries)}
          {renderColumn(columnThreeEntries)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollViewContent: {
    paddingVertical: 12,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 2,
  },
  column: {
    flex: 1,
  },
  mediaItem: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  videoContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  videoLoader: {
    position: "absolute",
    alignSelf: "center",
  },

  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  shimmer: {
    position: "relative",
    overflow: "hidden",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

// Home.jsx
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

export const CATEGORIES = [
  "All",
  "Funny",
  "Sports",
  "Music",
  "Kids",
  "Food",
  "Educational",
  "Tech",
  "Outdoors",
  "Art",
  "Fitness",
];

const CategoryButton = React.memo(({ category, isSelected, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryButton, isSelected && styles.selectedCategory]}
    onPress={onPress}
  >
    <Text
      style={[styles.categoryText, isSelected && styles.selectedCategoryText]}
    >
      {category}
    </Text>
  </TouchableOpacity>
));

const MediaItem = React.memo(({ entry, style, onPress }) => {
  const [isVideoReady, setIsVideoReady] = useState(false);

  return (
    <Pressable onPress={onPress}>
      <View style={style}>
        {entry.mediaType === "video" ? (
          <View style={[style, styles.videoContainer]}>
            <Video
              source={{ uri: entry.media }}
              style={[style, { width: "100%", height: "100%" }]}
              resizeMode="cover"
              shouldPlay={false}
              isMuted={true}
              useNativeControls={false}
              onLoad={() => setIsVideoReady(true)}
            />
            {!isVideoReady && (
              <ActivityIndicator
                style={styles.videoLoader}
                size="large"
                color="#0000ff"
              />
            )}
          </View>
        ) : (
          <Image
            source={{ uri: entry.media }}
            style={[style, { width: "100%", height: "100%" }]}
          />
        )}
      </View>
    </Pressable>
  );
});

export default function Home({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
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
      setFilteredEntries(data);
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

  useEffect(() => {
    if (selectedCategory === "All") {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) => entry.category === selectedCategory
      );
      setFilteredEntries(filtered);
    }
  }, [selectedCategory, entries]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEntries();
    setRefreshing(false);
  };

  const columnOneEntries = filteredEntries.filter(
    (_, index) => index % 3 === 0
  );
  const columnTwoEntries = filteredEntries.filter(
    (_, index) => index % 3 === 1
  );
  const columnThreeEntries = filteredEntries.filter(
    (_, index) => index % 3 === 2
  );

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
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <CategoryButton
            key={category}
            category={category}
            isSelected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
          />
        ))}
      </ScrollView>
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
        {/** Check if there are no entries and you're not loading */}
        {!loading && filteredEntries.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No entries available</Text>
          </View>
        ) : (
          <View style={styles.container}>
            {renderColumn(columnOneEntries)}
            {renderColumn(columnTwoEntries)}
            {renderColumn(columnThreeEntries)}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollViewContent: {
    paddingVertical: 12,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 2,
  },
  categoriesContainer: {
    maxHeight: 60,
    backgroundColor: "white",
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "#F0F0F0",
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: "#000000",
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4B5563",
  },
  selectedCategoryText: {
    color: "white",
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
  emptyText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
});

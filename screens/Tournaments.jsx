import React, { useEffect, useState, useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from "react-native";
import { supabase } from "../services/supabase";
import Icon from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const CATEGORY_EMOJIS = {
  All: "🌟",
  Funny: "😂",
  Sports: "⚽",
  Music: "🎵",
  Kids: "🧸",
  Food: "🍔",
  Educational: "📚",
  Tech: "💻",
  Outdoors: "🏕️",
  Art: "🎨",
  Fitness: "💪",
};

const fetchTournaments = async () => {
  try {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .order("created_at", { ascending: false }); // Sorting by 'created_at' in descending order

    if (error) {
      console.error("Error fetching tournaments:", error);
      return [];
    }
    return data;
  } catch (error) {
    console.error("Unexpected error fetching tournaments:", error);
    return [];
  }
};

const TournamentCard = ({ tournament, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[
            styles.statusBadge,
            tournament.openTournament ? styles.liveBadge : styles.closedBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              tournament.openTournament ? styles.liveText : styles.closedText,
            ]}
          >
            {tournament.openTournament ? "LIVE" : "CLOSED"}
          </Text>
        </View>
        <Text style={styles.entryFee}>
          {tournament.entryPrice ? `$${tournament.entryPrice}` : "FREE"}
        </Text>
      </View>

      <Text style={styles.tournamentName}>
        {tournament.tournamentName || "Unnamed Tournament"}
      </Text>

      <View style={styles.categoryContainer}>
        <Text style={styles.categoryText}>
          {CATEGORY_EMOJIS[tournament.category] || "🌟"}{" "}
          {tournament.category || "No Category"}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.entriesContainer}>
          <Text style={styles.entriesLabel}>Entries</Text>
          <Text style={styles.entriesValue}>
            {tournament.entriesSize || "∞"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onPress}
          style={[
            styles.joinButton,
            !tournament.openTournament && styles.closedButton,
          ]}
        >
          <Text
            style={[
              styles.joinButtonText,
              !tournament.openTournament && styles.closedButtonText,
            ]}
          >
            {tournament.openTournament ? "Join Now" : "Closed"}
          </Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default function Tournaments({ navigation }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadTournaments = async () => {
    const data = await fetchTournaments();
    setTournaments(data);
    setLoading(false);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTournaments();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadTournaments();
  }, []);

  const handlePress = (item) => {
    navigation.navigate("TournamentDetails", { item });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Preparing tournaments...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tournaments</Text>
        <Text style={styles.headerSubtitle}>
          {tournaments.length} Available
        </Text>
      </View>

      <FlatList
        data={tournaments}
        renderItem={({ item }) => (
          <TournamentCard tournament={item} onPress={() => handlePress(item)} />
        )}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]} // Android
            tintColor="#6366F1" // iOS
            title="Pull to refresh" // iOS
            titleColor="#6B7280" // iOS
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "white",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4B5563",
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  cardPressed: {
    backgroundColor: "#F9FAFB",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveBadge: {
    backgroundColor: "#FEE2E2",
  },
  closedBadge: {
    backgroundColor: "#E5E7EB",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  liveText: {
    color: "#DC2626",
  },
  closedText: {
    color: "#6B7280",
  },
  entryFee: {
    fontSize: 18,
    fontWeight: "700",
    color: "#059669",
  },
  tournamentName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    lineHeight: 28,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  entriesContainer: {
    flexDirection: "column",
  },
  entriesLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 2,
  },
  entriesValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  joinButton: {
    backgroundColor: "#6366F1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
    alignItems: "center",
  },
  closedButton: {
    backgroundColor: "#9CA3AF",
  },
  joinButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  closedButtonText: {
    color: "#F3F4F6",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
  },
});

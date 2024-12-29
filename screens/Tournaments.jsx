import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabase";

const fetchTournaments = async () => {
  try {
    const { data, error } = await supabase.from("tournaments").select("*");

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

const TournamentCard = ({ tournament, onPress }) => (
  <Pressable onPress={onPress}>
    <View style={styles.card}>
      <View style={styles.details}>
        <Text style={styles.tournamentName}>
          {tournament.tournamentName || "Unnamed Tournament"}
        </Text>
        <Text style={styles.entryFee}>
          Entry Fee:{" "}
          {tournament.entryPrice ? `$${tournament.entryPrice}` : "Free"}
        </Text>
        <Text style={styles.entriesSize}>
          Entries:{" "}
          {tournament.entriesSize ? `${tournament.entriesSize}` : "Open"}
        </Text>
        <Text style={styles.openTournament}>
          Status: {tournament.openTournament ? "Open" : "Closed"}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress} style={styles.joinButton}>
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  </Pressable>
);

export default function Tournaments({ navigation }) {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTournaments = async () => {
      const data = await fetchTournaments();

      setTournaments(data);
      setLoading(false);
    };

    loadTournaments();
  }, []);

  const handlePress = (item) => {
    navigation.navigate("TournamentDetails", { item });
  };

  const renderItem = ({ item }) => (
    <TournamentCard tournament={item} onPress={() => handlePress(item)} />
  );

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "white", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tournaments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  details: {
    flex: 1,
  },
  tournamentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  entryFee: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  entriesSize: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  openTournament: {
    fontSize: 14,
    color: "#666",
  },
  joinButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

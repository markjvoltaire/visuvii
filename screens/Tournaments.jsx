import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { supabase } from "../services/supabase";

const tournaments = [
  { id: "1", entryFee: "$40", totalPot: "$3,600", joined: "30 / 32" },
  { id: "2", entryFee: "$40", totalPot: "$3,600", joined: "30 / 32" },
  { id: "3", entryFee: "$40", totalPot: "$3,600", joined: "30 / 32" },
  { id: "4", entryFee: "$40", totalPot: "$3,600", joined: "30 / 32" },
];

export default function Tournaments({ navigation }) {
  const createTournament = async () => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) throw new Error("User is not authenticated.");

      const tournamentDetails = {
        creatorId: userId,
        entryPrice: 100,
        mediaType: "image",
        tournamentName: "BASKETBALL",
        entriesSize: 10,
        openTournament: true,
      };

      const { data, error } = await supabase
        .from("tournaments")
        .insert([tournamentDetails]);

      if (error) {
        console.error("Error creating tournament:", error.message);
      } else {
        console.log("Tournament created successfully:", data);
      }
    } catch (err) {
      console.error("Unexpected error:", err.message);
    }
  };

  const renderItem = ({ item }) => (
    <Pressable onPress={() => navigation.navigate("TournamentDetails")}>
      <View style={styles.card}>
        <View style={styles.details}>
          <Text style={styles.entryFee}>
            <Text>🎮</Text> Entry Fee
          </Text>
          <Text style={styles.totalPot}>Total Pot: {item.totalPot}</Text>
          <Text style={styles.joined}>{item.joined} joined</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("TournamentDetails")}
          style={styles.joinButton}
        >
          <Text style={styles.joinButtonText}>join for {item.entryFee}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={tournaments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <Pressable onPress={() => createTournament()}>
        <Text>Create Tournament</Text>
      </Pressable>
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
    elevation: 3, // For Android shadow
  },
  details: {
    flex: 1,
  },
  entryFee: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 4,
  },
  totalPot: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  joined: {
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

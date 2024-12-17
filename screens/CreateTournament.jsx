import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function CreateTournament() {
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentCategory, setTournamentCategory] = useState("");
  const [entryPrice, setEntryPrice] = useState("100");
  const [mediaType, setMediaType] = useState("image");
  const [entriesSize, setEntriesSize] = useState("10");
  const [openTournament, setOpenTournament] = useState("false");

  const createTournament = async () => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) throw new Error("User is not authenticated.");

      const tournamentDetails = {
        creatorId: userId,
        entryPrice: parseFloat(entryPrice),
        mediaType: mediaType,
        tournamentName: tournamentName,
        entriesSize: parseInt(entriesSize, 10),
        openTournament: openTournament === "true",
        category: tournamentCategory,
      };

      const { data, error } = await supabase
        .from("tournaments")
        .insert([tournamentDetails]);

      if (error) throw error;
      alert("Tournament created successfully!");
    } catch (error) {
      console.error("Error creating tournament:", error);
      alert("Failed to create tournament.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.header}>Create a Tournament</Text>

        <Text style={styles.label}>Tournament Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tournament name"
          value={tournamentName}
          onChangeText={setTournamentName}
        />

        <Text style={styles.label}>Tournament Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tournament description"
          value={tournamentCategory}
          onChangeText={setTournamentCategory}
        />

        <Text style={styles.label}>Entry Price</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter entry price"
          value={entryPrice}
          keyboardType="numeric"
          onChangeText={setEntryPrice}
        />

        <Text style={styles.label}>Media Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter media type"
          value={mediaType}
          onChangeText={setMediaType}
        />

        <TouchableOpacity style={styles.button} onPress={createTournament}>
          <Text style={styles.buttonText}>Create Tournament</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    top: 60,
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

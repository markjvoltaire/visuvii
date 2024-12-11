import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function CreateTournament() {
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentCategory, setTournamentCategory] = useState("");

  const createTournament = async () => {
    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) throw new Error("User is not authenticated.");

      const tournamentDetails = {
        creatorId: userId,
        entryPrice: 100,
        mediaType: "image",
        tournamentName: tournamentName,
        entriesSize: 10,
        openTournament: false,
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
        <Text style={styles.label}>Tournament Name:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter tournament name"
          value={tournamentName}
          onChangeText={setTournamentName}
        />
        <Text style={styles.label}>Tournament Description:</Text>
        <TextInput
          style={styles.input}
          placeholder="category"
          value={tournamentCategory}
          onChangeText={setTournamentCategory}
        />
        <Button title="Create Tournament" onPress={createTournament} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  formContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
});

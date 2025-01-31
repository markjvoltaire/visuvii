import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

export default function TournamentIntro({ navigation }) {
  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (type) => {
    setSelectedType(type);
    const route = type === "join" ? "Tournaments" : "CreateTournament";
    navigation.navigate(route, { type });
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tournament Hub</Text>
        <Text style={styles.subtitle}>Choose your path</Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect("join")}
          >
            <View style={[styles.iconContainer, styles.joinIcon]}>
              <Text style={styles.iconText}>🏆</Text>
            </View>
            <Text style={styles.optionTitle}>Join Tournament</Text>
            <Text style={styles.optionDescription}>
              Compete in live tournaments and win cash prizes in exciting
              competitions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionCard}
            onPress={() => handleSelect("create")}
          >
            <View style={[styles.iconContainer, styles.createIcon]}>
              <Text style={styles.iconText}>⚡</Text>
            </View>
            <Text style={styles.optionTitle}>Create Tournament</Text>
            <Text style={styles.optionDescription}>
              Host your own tournament and set up prize pools for participants
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 40,
  },
  optionsContainer: {
    gap: 20,
  },
  optionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  joinIcon: {
    backgroundColor: "#EEF2FF",
  },
  createIcon: {
    backgroundColor: "#FEF3C7",
  },
  iconText: {
    fontSize: 24,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#6B7280",
  },
});

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
      <View style={{ top: 150 }}>
        <Text style={styles.header}>
          Create a tournament or join a tournament
        </Text>
        {["join", "create"].map((type, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.option]}
            onPress={() => handleSelect(type)}
          >
            <View style={styles.optionContent}>
              <Text style={styles.optionText}>
                {type === "join" ? "Join" : "Create"}
              </Text>
              <Text style={styles.subText}>
                {type === "join"
                  ? "View live tournaments and join the competition for your chance to win a cash prize"
                  : "Create your own tournament and let people join to win a cash prize"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  option: {
    width: "100%",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedOption: {
    backgroundColor: "#4A90E2",
    shadowColor: "#4A90E2",
    shadowOpacity: 0.3,
  },
  optionContent: {
    alignItems: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  goBackButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "#333",
  },
  goBackText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

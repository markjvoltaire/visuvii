import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

export default function ContestEntryScreen({ route }) {
  const [accepted, setAccepted] = useState(false);

  const handleContinue = () => {
    if (!accepted) {
      Alert.alert("Terms Not Accepted", "Please accept the terms to continue.");
      return;
    }
    // Proceed to the next step
    Alert.alert("Success", "You have accepted the terms!");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView style={styles.container}>
        {/* <Text style={styles.title}>Contest Entry</Text> */}

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: route.params.media.uri }}
            style={styles.image}
          />
        </View>

        <Text style={styles.description}>
          I acknowledge that the content I upload is my own, and I am solely
          responsible for it. I agree to the terms and conditions, including any
          legal liabilities that may arise from my content.
        </Text>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              { backgroundColor: accepted ? "#FF8800" : "transparent" },
            ]}
            onPress={() => setAccepted(!accepted)}
          >
            {accepted && <Text style={styles.checkmark}>✓</Text>}
          </TouchableOpacity>
          <Text style={styles.checkboxText}>I accept terms and agreement</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.continueButton,
            { backgroundColor: accepted ? "#FF8800" : "#EEEFF2" },
          ]}
          onPress={handleContinue}
          disabled={!accepted}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#EEEFF2",
  },
  description: {
    fontSize: 14,
    color: "#6B6B6B",
    textAlign: "center",
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: "#6B6B6B",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkmark: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
  checkboxText: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  continueButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

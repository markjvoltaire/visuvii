import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visuvii</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("Name")}
        style={[styles.button, styles.createButton]}
      >
        <Text style={[styles.buttonText, styles.createButtonText]}>
          Create Account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF8800", // blue background as seen in the image
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginVertical: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 18,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "white",
  },
  createButtonText: {
    color: "white",
  },
});

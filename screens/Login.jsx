import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { supabase } from "../services/supabase";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    try {
      const { error } = await supabase.auth.signIn({
        email,
        password,
      });

      if (error) {
        Alert.alert("Login Error", error.message);
      } else {
        // Navigate to a different screen if needed
        // navigation.navigate('HomeScreen');
      }
    } catch (error) {
      Alert.alert("An error occurred. Please try again later.");
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate("ResetPassword");
  };

  return (
    <View style={styles.container}>
      {/* Go Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Go Back</Text>
      </TouchableOpacity>

      {/* Login Text */}
      <Text style={styles.title}>Log In</Text>
      <Text style={styles.subtitle}>Enter your credentials to login.</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        placeholderTextColor="#999"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      {/* Forgot Password Button */}
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* Terms and Conditions */}
      <Text style={styles.termsText}>
        By clicking, I accept the{" "}
        <Text style={styles.linkText}>Terms & Conditions</Text> and{" "}
        <Text style={styles.linkText}>Privacy Policy</Text>.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    marginTop: 40,
    marginBottom: 20,
  },
  backText: {
    fontSize: 16,
    color: "black",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPasswordText: {
    fontSize: 16,
    color: "#007AFF",
    textAlign: "center",
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  termsText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  linkText: {
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});

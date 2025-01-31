import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from "react-native";
import React, { useState, useCallback } from "react";
import { supabase } from "../services/supabase";

const FormInput = ({ label, ...props }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor="#94A3B8" {...props} />
  </View>
);

const ContentTypeToggle = ({ value, onToggle }) => {
  const handlePress = useCallback(() => {
    onToggle(value === "video" ? "photo" : "video");
  }, [value, onToggle]);

  return (
    <View style={styles.fieldContainer}>
      <Text style={styles.fieldLabel}>Content Type</Text>
      <TouchableOpacity
        style={styles.toggleContainer}
        activeOpacity={0.8}
        onPress={handlePress}
      >
        <View
          style={[
            styles.toggleOption,
            value === "video" && styles.toggleOptionActive,
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              value === "video" && styles.toggleTextActive,
            ]}
          >
            Video
          </Text>
        </View>
        <View
          style={[
            styles.toggleOption,
            value === "photo" && styles.toggleOptionActive,
          ]}
        >
          <Text
            style={[
              styles.toggleText,
              value === "photo" && styles.toggleTextActive,
            ]}
          >
            Photo
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default function CreateTournament({ navigation }) {
  const [formData, setFormData] = useState({
    tournamentName: "",
    category: "",
    entryPrice: "100",
    mediaType: "video",
    entriesSize: "10",
    openTournament: "true",
  });

  const updateFormField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.tournamentName.trim()) {
      Alert.alert("Error", "Please enter a tournament name");
      return false;
    }
    if (!formData.category.trim()) {
      Alert.alert("Error", "Please enter a tournament category");
      return false;
    }
    if (isNaN(formData.entryPrice) || parseFloat(formData.entryPrice) < 0) {
      Alert.alert("Error", "Please enter a valid entry price");
      return false;
    }
    return true;
  };

  const handleCreateTournament = async () => {
    if (!validateForm()) return;

    try {
      const userId = supabase.auth.currentUser?.id;
      if (!userId) throw new Error("Authentication required");

      const { error } = await supabase.from("tournaments").insert([
        {
          creatorId: userId,
          tournamentName: formData.tournamentName,
          category: formData.category,
          entryPrice: parseFloat(formData.entryPrice),
          mediaType: formData.mediaType,
          entriesSize: parseInt(formData.entriesSize),
          openTournament: formData.openTournament === "true",
        },
      ]);

      if (error) throw error;

      Alert.alert("Success", "Tournament created successfully", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Tournament creation error:", error);
      Alert.alert("Error", "Failed to create tournament. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>New Tournament</Text>
          <Text style={styles.headerSubtitle}>
            Set up your tournament details
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.form}>
            <FormInput
              label="Tournament Name"
              placeholder="Enter tournament name"
              value={formData.tournamentName}
              onChangeText={(value) => updateFormField("tournamentName", value)}
            />

            <FormInput
              label="Category"
              placeholder="e.g., Gaming, Sports, Art"
              value={formData.category}
              onChangeText={(value) => updateFormField("category", value)}
            />

            <View style={styles.row}>
              <View style={styles.col}>
                <FormInput
                  label="Entry Fee ($)"
                  placeholder="100"
                  keyboardType="numeric"
                  value={formData.entryPrice}
                  onChangeText={(value) => updateFormField("entryPrice", value)}
                />
              </View>
              <View style={styles.col}>
                <FormInput
                  label="Max Entries"
                  placeholder="10"
                  keyboardType="numeric"
                  value={formData.entriesSize}
                  onChangeText={(value) =>
                    updateFormField("entriesSize", value)
                  }
                />
              </View>
            </View>

            <ContentTypeToggle
              value={formData.mediaType}
              onToggle={(value) => updateFormField("mediaType", value)}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleCreateTournament}
          >
            <Text style={styles.submitButtonText}>Create Tournament</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 24,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#64748B",
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 24,
    gap: 20,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  col: {
    flex: 1,
  },
  footer: {
    padding: 24,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  submitButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  // New styles for the toggle
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    overflow: "hidden",
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  toggleOptionActive: {
    backgroundColor: "#3B82F6",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
  toggleTextActive: {
    color: "#FFFFFF",
  },
});

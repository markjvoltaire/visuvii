import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { supabase } from "../services/supabase";

export default function UserProfile({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("profile :>> ", profile);

  // Get current user ID
  const userId = supabase.auth.currentUser?.id;

  // Fetch user profile on component mount
  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    } else {
      setLoading(false);
      setError("User not logged in");
    }
  }, [userId]);

  const fetchUserProfile = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;

      setProfile(data);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => userId && fetchUserProfile(userId)}
        >
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profile?.profileImage
                  ? { uri: profile.profileImage }
                  : require("../assets/pic2.jpg")
              }
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{profile?.username || "User"}</Text>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              ${profile?.balance?.toFixed(2) || "0.00"}
            </Text>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>Withdraw Funds</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {["Account Overview", "Transaction History", "Account Settings"].map(
            (item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <Text style={styles.menuItemText}>{item}</Text>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )
          )}
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          {[
            "Tax Center",
            "Help & Support",
            "Terms and Policies",
            "Rules and Scoring",
          ].map((item, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate(item)}
              key={index}
              style={styles.menuItem}
            >
              <Text style={styles.menuItemText}>{item}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={signOutUser} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#6366F1",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#EF4444",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryText: {
    color: "white",
    fontWeight: "600",
  },
  header: {
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#FFF",
  },
  imageContainer: {
    padding: 3,
    borderRadius: 999,
    backgroundColor: "#6366F1",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFF",
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginTop: 12,
    marginBottom: 20,
  },
  balanceCard: {
    backgroundColor: "#EEF2FF",
    padding: 20,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 14,
    color: "#6366F1",
    fontWeight: "600",
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  withdrawButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  withdrawText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  menuSection: {
    backgroundColor: "#FFF",
    marginTop: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  menuItemText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "500",
  },
  chevron: {
    fontSize: 20,
    color: "#9CA3AF",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginVertical: 24,
    backgroundColor: "#EF4444",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
});

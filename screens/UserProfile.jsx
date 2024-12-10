import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { supabase } from "../services/supabase";

export default function UserProfile() {
  const signOutUser = async () => {
    await supabase.auth.signOut();
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ padding: 10 }}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <Image
            source={require("../assets/pic2.jpg")} // Replace with actual profile picture URL
            style={styles.profileImage}
          />
          <Text style={styles.userName}>John Apple</Text>
          <Text style={styles.playableBalance}>Playable Balance</Text>
          <Text style={styles.balanceAmount}>$35.00</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>Account Overview</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Transaction History</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Account Settings</Text>
          </View>
        </View>

        {/* Support & About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support & About</Text>
          <View style={styles.item}>
            <Text style={styles.itemText}>Tax Center</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Help & Support</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Terms and Policies</Text>
          </View>
          <View style={styles.item}>
            <Text style={styles.itemText}>Rules and Scoring</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity onPress={signOutUser} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 20,
  },
  backArrow: {
    fontSize: 24,
    color: "#000",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  playableBalance: {
    fontSize: 16,
    color: "#888",
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#0066FF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  logoutText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

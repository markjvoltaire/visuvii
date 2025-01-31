import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

const payouts = [
  { id: "1", place: "1st", prize: "$20,000" },
  { id: "2", place: "2nd", prize: "$15,000" },
  { id: "3", place: "3rd", prize: "$10,000" },
  { id: "4", place: "4th", prize: "$5,000" },
  { id: "5", place: "5th", prize: "Entry Fee Return" },
  { id: "6", place: "6th", prize: "Entry Fee Return" },
];

const PayoutItem = ({ place, prize }) => (
  <View style={styles.payoutRow}>
    <View style={styles.rankContainer}>
      <Text style={styles.placeText}>{place}</Text>
    </View>
    <View style={styles.prizeContainer}>
      <Text style={styles.prizeText}>{prize}</Text>
      <Text style={styles.prizeLabel}>Prize</Text>
    </View>
  </View>
);

export default function TournamentDetails({ navigation, route }) {
  const { item } = route.params;

  console.log("item :>> ", item);

  const handleEnterTournament = () => {
    // Navigate to different screens based on mediaType
    const screenName =
      item.mediaType === "image" ? "UploadImage" : "UploadVideo";
    navigation.navigate(screenName, { item });
  };

  const renderItem = ({ item }) => (
    <PayoutItem place={item.place} prize={item.prize} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prize Pool</Text>
        <Text style={styles.subtitle}>Tournament Payouts</Text>
      </View>

      <FlatList
        data={payouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleEnterTournament}
          style={styles.enterButton}
        >
          <Text style={styles.enterButtonText}>Enter Tournament</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    backgroundColor: "#FFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  rankContainer: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  placeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366F1",
  },
  prizeContainer: {
    flex: 1,
  },
  prizeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#059669",
    marginBottom: 2,
  },
  prizeLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: "#FFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  enterButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#6366F1",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  enterButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
    letterSpacing: 0.5,
  },
});

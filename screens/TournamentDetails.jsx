import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

// Example function to calculate payouts
// Adjust to match your existing code.
const calculatePayouts = (entriesSize, entryPrice) => {
  const totalPot = entriesSize * entryPrice;
  const prizePool = totalPot * 0.9; // 90% of total pot
  const winnersCount = Math.ceil(entriesSize * 0.25);
  let payouts = [];

  if (winnersCount <= 10) {
    // For small tournaments, we scale percentages
    const idealArray = [25, 15, 10, 7, 5, 4, 4, 4, 4, 4]; // sums to 79
    const percentages = idealArray.slice(0, winnersCount);
    const sumPercent = percentages.reduce((acc, curr) => acc + curr, 0);

    payouts = percentages.map((p, index) => {
      const fraction = p / sumPercent; // e.g., 25 / 79 ≈ 0.316
      return {
        place: getOrdinal(index + 1),
        prize: `$${(prizePool * fraction).toFixed(2)}`,
        // fraction of the total prizePool (e.g. 0.316)
        percentage: fraction,
      };
    });
  } else {
    // 1st Place
    payouts.push({
      place: getOrdinal(1),
      prize: `$${(prizePool * 0.25).toFixed(2)}`,
      percentage: 0.25, // 25%
    });
    // 2nd Place
    payouts.push({
      place: getOrdinal(2),
      prize: `$${(prizePool * 0.15).toFixed(2)}`,
      percentage: 0.15, // 15%
    });
    // 3rd Place
    payouts.push({
      place: getOrdinal(3),
      prize: `$${(prizePool * 0.1).toFixed(2)}`,
      percentage: 0.1, // 10%
    });
    // 4th Place
    payouts.push({
      place: getOrdinal(4),
      prize: `$${(prizePool * 0.07).toFixed(2)}`,
      percentage: 0.07, // 7%
    });
    // 5th Place
    payouts.push({
      place: getOrdinal(5),
      prize: `$${(prizePool * 0.05).toFixed(2)}`,
      percentage: 0.05, // 5%
    });

    // 6th-10th Places: each 4%
    for (let i = 6; i <= Math.min(10, winnersCount); i++) {
      payouts.push({
        place: getOrdinal(i),
        prize: `$${(prizePool * 0.04).toFixed(2)}`,
        percentage: 0.04, // 4%
      });
    }

    // 11th+ Places: share 18% evenly
    if (winnersCount > 10) {
      const remainingWinners = winnersCount - 10;
      const perWinner = (prizePool * 0.18) / remainingWinners;
      const fraction = 0.18 / remainingWinners; // each person's fraction of the entire pool
      for (let i = 11; i <= winnersCount; i++) {
        payouts.push({
          place: getOrdinal(i),
          prize: `$${perWinner.toFixed(2)}`,
          percentage: fraction,
        });
      }
    }
  }
  return payouts;
};

// Helper to get ordinal strings like "1st", "2nd", etc.
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
export default function TournamentDetails({ navigation, route }) {
  const { item } = route.params;
  console.log("item :>> ", item);

  // Calculate dynamic payouts using the tournament data from item
  const dynamicPayouts = calculatePayouts(item.entriesSize, item.entryPrice);

  const handleEnterTournament = () => {
    // Navigate to different screens based on mediaType
    const screenName =
      item.mediaType === "image" ? "UploadImage" : "UploadVideo";
    navigation.navigate(screenName, { item });
  };

  const renderItem = ({ item }) => (
    <View style={styles.payoutRow}>
      <View style={styles.rankContainer}>
        <Text style={styles.placeText}>{item.place}</Text>
      </View>
      <View style={styles.prizeContainer}>
        <Text style={styles.prizeText}>{item.prize}</Text>
        <Text style={styles.prizeLabel}>Prize</Text>

        {/* 
          ONLY show this extra line if it's the "1st" place row.
          We use the 'percentage' field (0.25 = 25%) to show the exact fraction.
        */}
        {item.place === "1st" && item.percentage && (
          <Text style={styles.firstPlaceNote}>
            {(item.percentage * 100).toFixed(2)}% of tournament fulfillment
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Prize Pool</Text>
        <Text style={styles.subtitle}>Tournament Payouts</Text>

        <Text style={styles.note}>
          prizes listed are based on 100% tournament fulfillment
        </Text>
      </View>

      <FlatList
        data={dynamicPayouts}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
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
  note: {
    marginTop: 4,
    fontSize: 13,
    color: "#6B7280", // Red text; adjust as desired
  },
  firstPlaceNote: {
    fontSize: 14,
    color: "#EF4444", // Red text for emphasis
    marginTop: 2,
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

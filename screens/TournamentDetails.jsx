import React from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";

// Helper to get ordinal strings like "1st", "2nd", etc.
function getOrdinal(n) {
  const s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Calculates the tournament payouts based on:
 *  - 90% prize pool (10% platform fee)
 *  - Top 25% winners
 *  - Fixed distribution for places 1-10
 *  - Leftover distribution for places 11-25 (18% total)
 *
 * If leftover winners < 15, we scale down the 18% so
 * no leftover place exceeds the 4% that 6th-10th places get.
 */
function calculatePayouts(entriesSize, entryPrice) {
  const totalPot = entriesSize * entryPrice;
  const prizePool = totalPot * 0.9; // 90% of total pot
  const winnersCount = Math.ceil(entriesSize * 0.25);

  let payouts = [];

  // If the total winners are 10 or fewer, use the "small tournament" scaling approach.
  if (winnersCount <= 10) {
    // Ideal array for up to 10 positions
    const idealArray = [25, 15, 10, 7, 5, 4, 4, 4, 4, 4]; // sums to 79
    // Only take as many as we need
    const percentages = idealArray.slice(0, winnersCount);
    const sumPercent = percentages.reduce((acc, curr) => acc + curr, 0);

    payouts = percentages.map((p, index) => {
      const fraction = p / sumPercent; // fraction of the total prize pool
      return {
        place: getOrdinal(index + 1),
        prize: `$${(prizePool * fraction).toFixed(2)}`,
        percentage: fraction, // e.g., 0.25 for 25%
      };
    });
  } else {
    // Fixed distribution for places 1-5
    payouts.push({
      place: getOrdinal(1),
      prize: `$${(prizePool * 0.25).toFixed(2)}`,
      percentage: 0.25,
    });
    payouts.push({
      place: getOrdinal(2),
      prize: `$${(prizePool * 0.15).toFixed(2)}`,
      percentage: 0.15,
    });
    payouts.push({
      place: getOrdinal(3),
      prize: `$${(prizePool * 0.1).toFixed(2)}`,
      percentage: 0.1,
    });
    payouts.push({
      place: getOrdinal(4),
      prize: `$${(prizePool * 0.07).toFixed(2)}`,
      percentage: 0.07,
    });
    payouts.push({
      place: getOrdinal(5),
      prize: `$${(prizePool * 0.05).toFixed(2)}`,
      percentage: 0.05,
    });

    // Places 6-10 each get 4%
    for (let i = 6; i <= Math.min(10, winnersCount); i++) {
      payouts.push({
        place: getOrdinal(i),
        prize: `$${(prizePool * 0.04).toFixed(2)}`,
        percentage: 0.04,
      });
    }

    // Now handle leftover winners: positions 11+
    if (winnersCount > 10) {
      const leftoverWinners = winnersCount - 10;

      // By default, leftover gets 18% total (for places 11-25).
      // But if leftoverWinners < 15, we scale down so each leftover place
      // gets only 1.2% of the prize pool, ensuring 10th place (4%) is never exceeded.
      let leftoverPercent = 0.18; // 18%

      if (leftoverWinners < 15) {
        // Each leftover position would have been 1.2% (0.012),
        // so leftoverPercent = leftoverWinners * 0.012
        leftoverPercent = leftoverWinners * 0.012; // e.g. if leftoverWinners=3 => 3.6% total
      }

      const perWinner = (prizePool * leftoverPercent) / leftoverWinners;
      const fractionPerWinner = leftoverPercent / leftoverWinners;

      for (let i = 11; i <= winnersCount; i++) {
        payouts.push({
          place: getOrdinal(i),
          prize: `$${perWinner.toFixed(2)}`,
          percentage: fractionPerWinner,
        });
      }
    }
  }

  return payouts;
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

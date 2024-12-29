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
    <View style={styles.circle}>
      <Text style={styles.placeText}>{place}</Text>
    </View>
    <Text style={styles.prizeText}>{prize}</Text>
  </View>
);

export default function TournamentDetails({ navigation, route }) {
  const { item } = route.params;

  const renderItem = ({ item }) => (
    <PayoutItem place={item.place} prize={item.prize} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Prize Payouts</Text>
      <FlatList
        data={payouts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("UploadMedia", { item })}
        style={styles.enterButton}
      >
        <Text style={styles.enterButtonText}>Enter Now</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    textAlign: "center",
  },
  listContent: {
    paddingBottom: 100,
  },
  payoutRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    padding: 10,
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  placeText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  prizeText: {
    fontSize: 16,
    color: "#000",
  },
  enterButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 12,
    borderRadius: 8,
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  enterButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
});

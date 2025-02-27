import React from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";

export default function Rules() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>
            How Tournament Payouts Are Calculated
          </Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Building the Prize Pool</Text>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>Total Money Collected:</Text>
              <Text style={styles.itemText}>
                Every participant pays an entry fee. The total money collected
                (or "pot") is simply the number of players multiplied by the
                entry fee.
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>Platform Fee and Prize Pool:</Text>
              <Text style={styles.itemText}>
                From this total pot, 10% is taken as a fee by the platform. The
                remaining 90% becomes the prize pool – this is the money that
                will be given out as prizes.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Deciding Who Wins</Text>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>Top 25% Rule:</Text>
              <Text style={styles.itemText}>
                Only the top 25% of the entrants will win a prize. For example,
                if 100 people enter, the top 25 players will get something.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              3. Splitting Up the Prize Pool
            </Text>
            <Text style={styles.itemText}>
              Depending on how many winners there are, we split the prize pool
              into different portions:
            </Text>

            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>
                For Smaller Tournaments (When There Are 10 or Fewer Winners):
              </Text>
              <Text style={styles.itemText}>
                • We use a list of percentages (like 25%, 15%, 10%, etc.) that
                are meant for 10 spots.
              </Text>
              <Text style={styles.itemText}>
                • Since there might be fewer than 10 winners, we adjust these
                percentages so that all the prize money is fairly distributed
                among the winners.
              </Text>
            </View>

            <View style={styles.subsection}>
              <Text style={styles.subsectionTitle}>
                For Larger Tournaments (More Than 10 Winners):
              </Text>

              <View style={styles.item}>
                <Text style={styles.itemTitle}>Top 5 Winners:</Text>
                <Text style={styles.itemText}>
                  • 1st place gets 25% of the prize pool.
                </Text>
                <Text style={styles.itemText}>• 2nd place gets 15%.</Text>
                <Text style={styles.itemText}>• 3rd place gets 10%.</Text>
                <Text style={styles.itemText}>• 4th place gets 7%.</Text>
                <Text style={styles.itemText}>• 5th place gets 5%.</Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemTitle}>
                  Winners Ranked 6th to 10th:
                </Text>
                <Text style={styles.itemText}>
                  Each of these positions receives 4% of the prize pool.
                </Text>
              </View>

              <View style={styles.item}>
                <Text style={styles.itemTitle}>
                  Winners Ranked 11th and Beyond:
                </Text>
                <Text style={styles.itemText}>
                  In our plan, if there were exactly 25 winners, the remaining
                  15 winners (from 11th to 25th) would share 18% of the prize
                  pool. This means each would normally get about 1.2%.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              4. Keeping It Fair for Everyone
            </Text>
            <Text style={styles.itemText}>
              Sometimes the tournament doesn't have as many winners as
              originally planned. For example, if only 13 people win instead of
              25, here's what can happen:
            </Text>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>Problem:</Text>
              <Text style={styles.itemText}>
                If we just split the full 18% among fewer players, each of these
                lower-ranked winners (like the one in 11th place) might end up
                with more money than someone in 10th place, which wouldn't seem
                fair.
              </Text>
            </View>

            <View style={styles.item}>
              <Text style={styles.itemTitle}>Solution:</Text>
              <Text style={styles.itemText}>
                To keep the order fair, we adjust the share for the lower-ranked
                winners when there aren't as many as expected. Instead of giving
                them a bigger share when there are fewer players, we limit it so
                that each winner from 11th onward still gets the same small
                portion (around 1.2%). This way, the prize for 10th place (4%)
                always stays higher than that for 11th place.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. In Summary</Text>
            <Text style={styles.itemText}>
              • Total Pot: Money from all entry fees.
            </Text>
            <Text style={styles.itemText}>
              • Prize Pool: 90% of the total pot (after deducting a 10% fee).
            </Text>
            <Text style={styles.itemText}>
              • Winners: The top 25% of players.
            </Text>
            <Text style={styles.itemText}>• Payouts:</Text>
            <Text style={styles.itemText}>
              - For small tournaments, we adjust a preset list of percentages to
              fit the number of winners.
            </Text>
            <Text style={styles.itemText}>
              - For larger tournaments, we use fixed percentages for the top 10
              positions and a planned share for lower positions.
            </Text>
            <Text style={styles.itemText}>• Fairness:</Text>
            <Text style={styles.itemText}>
              If there aren't enough winners in the lower positions, we scale
              down their shares to ensure no one in a lower spot (like 11th)
              ends up getting more than someone in a higher spot (like 10th).
            </Text>
          </View>

          <Text style={styles.conclusion}>
            This method ensures that the distribution is fair, transparent, and
            adapts to both small and large tournaments.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 60, // Extra padding for header transparency
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  item: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 4,
  },
  itemText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 8,
  },
  subsection: {
    marginTop: 12,
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#E5E7EB",
  },
  subsectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  conclusion: {
    fontSize: 15,
    fontStyle: "italic",
    color: "#4B5563",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
});

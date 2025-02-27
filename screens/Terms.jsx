import React from "react";
import { SafeAreaView, StyleSheet, Text, View, ScrollView } from "react-native";

export default function Terms() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Terms and Conditions</Text>
          <Text style={styles.date}>Last Updated: February 26, 2025</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
            <Text style={styles.paragraph}>
              By accessing or using our mobile application, you agree to be
              bound by these Terms and Conditions. If you disagree with any part
              of the terms, you may not access the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>2. Use of the Application</Text>
            <Text style={styles.paragraph}>
              2.1 You must be at least 18 years old to participate in
              tournaments involving real money.
            </Text>
            <Text style={styles.paragraph}>
              2.2 You are responsible for maintaining the confidentiality of
              your account and password.
            </Text>
            <Text style={styles.paragraph}>
              2.3 You agree to accept responsibility for all activities that
              occur under your account.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>3. Entry Fees and Payouts</Text>
            <Text style={styles.paragraph}>
              3.1 All entry fees are final and non-refundable once a tournament
              has begun.
            </Text>
            <Text style={styles.paragraph}>
              3.2 Tournament payouts are calculated according to our payout
              structure as described in the Rules and Scoring section.
            </Text>
            <Text style={styles.paragraph}>
              3.3 We reserve the right to cancel any tournament if there are not
              enough participants. In such cases, entry fees will be refunded.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>4. User Conduct</Text>
            <Text style={styles.paragraph}>
              4.1 You agree not to use any automated systems or software to
              extract data from our application.
            </Text>
            <Text style={styles.paragraph}>
              4.2 You agree not to attempt to defraud other users or manipulate
              tournament results.
            </Text>
            <Text style={styles.paragraph}>
              4.3 You agree not to use the application for any illegal purposes
              or to violate any laws in your jurisdiction.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>5. Withdrawal of Funds</Text>
            <Text style={styles.paragraph}>
              5.1 You may request to withdraw your available balance at any time
              through the application.
            </Text>
            <Text style={styles.paragraph}>
              5.2 Withdrawals are subject to verification of identity in
              accordance with applicable laws.
            </Text>
            <Text style={styles.paragraph}>
              5.3 Processing times for withdrawals may vary depending on the
              payment method.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
            <Text style={styles.paragraph}>
              6.1 The application and its original content, features, and
              functionality are owned by us and are protected by international
              copyright, trademark, and other intellectual property laws.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>7. Termination</Text>
            <Text style={styles.paragraph}>
              7.1 We may terminate or suspend your account immediately, without
              prior notice or liability, for any reason whatsoever, including
              without limitation if you breach the Terms.
            </Text>
            <Text style={styles.paragraph}>
              7.2 Upon termination, your right to use the application will
              immediately cease.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              8.1 In no event shall we be liable for any indirect, incidental,
              special, consequential or punitive damages, including without
              limitation, loss of profits, data, use, goodwill, or other
              intangible losses, resulting from your access to or use of or
              inability to access or use the application.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>9. Changes to Terms</Text>
            <Text style={styles.paragraph}>
              9.1 We reserve the right, at our sole discretion, to modify or
              replace these Terms at any time. We will provide notice of any
              changes by posting the new Terms on the application.
            </Text>
            <Text style={styles.paragraph}>
              9.2 By continuing to access or use our application after those
              revisions become effective, you agree to be bound by the revised
              terms.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>10. Governing Law</Text>
            <Text style={styles.paragraph}>
              10.1 These Terms shall be governed and construed in accordance
              with the laws, without regard to its conflict of law provisions.
            </Text>
            <Text style={styles.paragraph}>
              10.2 Our failure to enforce any right or provision of these Terms
              will not be considered a waiver of those rights.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>11. Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms, please contact us at
              support@example.com.
            </Text>
          </View>
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
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    marginBottom: 8,
  },
});

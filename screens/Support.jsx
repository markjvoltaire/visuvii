import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";

export default function Support() {
  const handleContactSupport = () => {
    Linking.canOpenURL("mailto:support@example.com").then((supported) => {
      if (supported) {
        Linking.openURL("mailto:support@example.com");
      } else {
        Alert.alert(
          "Email Not Available",
          "Your device doesn't support sending emails. Please contact us at support@example.com.",
          [{ text: "OK" }]
        );
      }
    });
  };

  const handleVisitFAQ = () => {
    // Replace with your actual FAQ URL
    Linking.openURL("https://example.com/faq");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Help & Support</Text>
          <Text style={styles.subtitle}>We're here to help you</Text>

          <View style={styles.contactSection}>
            <TouchableOpacity
              style={styles.contactButton}
              onPress={handleContactSupport}
            >
              <Text style={styles.contactButtonText}>Contact Support Team</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                How do I withdraw my funds?
              </Text>
              <Text style={styles.faqAnswer}>
                To withdraw your funds, navigate to your Profile page and tap on
                "Withdraw Funds" under your available balance. Follow the
                instructions to complete your withdrawal.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                When will I receive my tournament winnings?
              </Text>
              <Text style={styles.faqAnswer}>
                Tournament winnings are usually credited to your account within
                24 hours after the tournament ends. For larger tournaments, it
                may take up to 48 hours.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                How are tournament winners determined?
              </Text>
              <Text style={styles.faqAnswer}>
                Tournament winners are determined based on the total points
                accumulated during the tournament period. The exact scoring
                system varies by tournament type and is explained in the
                tournament details.
              </Text>
            </View>

            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>
                What payment methods are accepted?
              </Text>
              <Text style={styles.faqAnswer}>
                We accept various payment methods including credit/debit cards,
                PayPal, and bank transfers. For a complete list, please visit
                the Payment Methods section in your Account Settings.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={handleVisitFAQ}
            >
              <Text style={styles.viewMoreText}>View All FAQs</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Hours</Text>
            <Text style={styles.paragraph}>
              Our customer support team is available to assist you from Monday
              to Friday, 9:00 AM to 5:00 PM EST. During weekends, we offer
              limited support for urgent matters.
            </Text>
            <Text style={styles.paragraph}>
              Expected response time: 24 hours during business days.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Report Issues</Text>
            <Text style={styles.paragraph}>
              If you encounter any technical issues or have concerns about a
              tournament, please provide the following information when
              contacting support:
            </Text>
            <Text style={styles.listItem}>• Your username</Text>
            <Text style={styles.listItem}>• Date and time of the issue</Text>
            <Text style={styles.listItem}>• Tournament ID (if applicable)</Text>
            <Text style={styles.listItem}>• Description of the problem</Text>
            <Text style={styles.listItem}>• Screenshots (if possible)</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Resources</Text>
            <TouchableOpacity style={styles.resourceLink}>
              <Text style={styles.resourceText}>
                Beginner's Guide to Tournaments
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceLink}>
              <Text style={styles.resourceText}>Common Account Issues</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resourceLink}>
              <Text style={styles.resourceText}>Payment Troubleshooting</Text>
            </TouchableOpacity>
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
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 24,
  },
  contactSection: {
    marginBottom: 24,
  },
  contactButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#6366F1",
  },
  listItem: {
    fontSize: 15,
    color: "#4B5563",
    lineHeight: 22,
    marginBottom: 6,
    paddingLeft: 8,
  },
  resourceLink: {
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    marginBottom: 8,
  },
  resourceText: {
    fontSize: 15,
    color: "#4F46E5",
    fontWeight: "500",
  },
});

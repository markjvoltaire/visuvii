import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function Dob({ navigation, route }) {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const dayRef = useRef(null);
  const yearRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const { firstName, lastName } = route.params;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDateChange = (type, value) => {
    const numericValue = value.replace(/[^0-9]/g, "");

    switch (type) {
      case "month":
        if (numericValue.length <= 2) {
          setMonth(numericValue);
          if (numericValue.length === 2 && parseInt(numericValue) <= 12) {
            dayRef.current?.focus();
          }
        }
        break;
      case "day":
        if (numericValue.length <= 2) {
          setDay(numericValue);
          if (numericValue.length === 2 && parseInt(numericValue) <= 31) {
            yearRef.current?.focus();
          }
        }
        break;
      case "year":
        if (numericValue.length <= 4) {
          setYear(numericValue);
        }
        break;
    }

    setError("");
  };

  const calculateAge = (birthMonth, birthDay, birthYear) => {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const validateDate = () => {
    const monthNum = parseInt(month);
    const dayNum = parseInt(day);
    const yearNum = parseInt(year);

    if (monthNum < 1 || monthNum > 12) {
      return "Please enter a valid month (1-12)";
    }

    if (dayNum < 1 || dayNum > 31) {
      return "Please enter a valid day (1-31)";
    }

    // Check for valid days in each month
    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    if (dayNum > daysInMonth) {
      return `Invalid day for ${monthNum}/${yearNum}`;
    }

    const age = calculateAge(monthNum, dayNum, yearNum);
    if (age < 13) {
      return "You must be at least 13 years old";
    }
    if (age > 120) {
      return "Please enter a valid date of birth";
    }

    return null;
  };

  const handleSubmit = () => {
    if (
      !month ||
      !day ||
      !year ||
      month.length !== 2 ||
      day.length !== 2 ||
      year.length !== 4
    ) {
      setError("Please complete all date fields");
      return;
    }

    const validationError = validateDate();
    if (validationError) {
      setError(validationError);
      return;
    }

    navigation.navigate("SignUp", {
      month,
      day,
      year,
      firstName,
      lastName,
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>When's Your Birthday?</Text>
              <Text style={styles.subtitle}>Enter your date of birth</Text>
            </View>

            <View style={styles.dateContainer}>
              <View style={styles.dateInputRow}>
                <View style={styles.dateInputGroup}>
                  <Text style={styles.label}>Month</Text>
                  <TextInput
                    style={styles.dateInput}
                    value={month}
                    onChangeText={(value) => handleDateChange("month", value)}
                    placeholder="MM"
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                    onSubmitEditing={() => dayRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

                <Text style={styles.separator}>/</Text>

                <View style={styles.dateInputGroup}>
                  <Text style={styles.label}>Day</Text>
                  <TextInput
                    ref={dayRef}
                    style={styles.dateInput}
                    value={day}
                    onChangeText={(value) => handleDateChange("day", value)}
                    placeholder="DD"
                    keyboardType="number-pad"
                    maxLength={2}
                    returnKeyType="next"
                    onSubmitEditing={() => yearRef.current?.focus()}
                    blurOnSubmit={false}
                  />
                </View>

                <Text style={styles.separator}>/</Text>

                <View style={styles.dateInputGroup}>
                  <Text style={styles.label}>Year</Text>
                  <TextInput
                    ref={yearRef}
                    style={styles.dateInput}
                    value={year}
                    onChangeText={(value) => handleDateChange("year", value)}
                    placeholder="YYYY"
                    keyboardType="number-pad"
                    maxLength={4}
                    returnKeyType="done"
                    onSubmitEditing={handleSubmit}
                  />
                </View>
              </View>

              {error ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!month || !day || !year) && styles.buttonDisabled,
              ]}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Continue</Text>
              <Ionicons
                name="arrow-forward"
                size={20}
                color="white"
                style={styles.buttonIcon}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  inner: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 40 : 20,
  },
  contentContainer: {
    flex: 1,
    marginTop: 32,
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  dateContainer: {
    marginBottom: 32,
  },
  dateInputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    marginBottom: 16,
  },
  dateInputGroup: {
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
    textAlign: "center",
  },
  dateInput: {
    width: 70,
    height: 56,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e1e1e1",
    borderRadius: 12,
    fontSize: 18,
    textAlign: "center",
    color: "#1a1a1a",
  },
  separator: {
    fontSize: 24,
    color: "#666",
    marginHorizontal: 12,
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginLeft: 8,
  },
  button: {
    height: 56,
    backgroundColor: "#FF7A45",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF7A45",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: "#FFB499",
    shadowOpacity: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
});

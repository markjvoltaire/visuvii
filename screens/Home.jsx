import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Animated,
  Pressable,
} from "react-native";

// Import your images
const images = [
  require("../assets/pic1.jpg"),
  require("../assets/pic2.jpg"),
  require("../assets/pic3.jpg"),
  require("../assets/pic4.jpg"),
  require("../assets/pic5.jpg"),
  require("../assets/pic6.jpg"),
  require("../assets/pic7.jpg"),
  require("../assets/pic8.jpg"),
  require("../assets/pic9.jpg"),
  require("../assets/pic10.jpg"),
  require("../assets/pic11.jpg"),
  require("../assets/pic12.jpg"),
  require("../assets/pic13.jpg"),
  require("../assets/pic14.jpg"),
  require("../assets/pic15.jpg"),
  require("../assets/pic16.jpg"),
  require("../assets/pic17.jpg"),
  require("../assets/pic18.jpg"),
];

export default function Home({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true); // State for loading
  const numColumns = 3; // Number of columns
  const margin = 1;
  const imageSize =
    (Dimensions.get("window").width - margin * (numColumns + 1)) / numColumns;

  // Split images into three separate arrays for three columns
  const columnOneImages = images.filter((_, index) => index % 3 === 0);
  const columnTwoImages = images.filter((_, index) => index % 3 === 1);
  const columnThreeImages = images.filter((_, index) => index % 3 === 2);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a network request, then set refreshing to false
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 1000);
  }, []);

  // Function to create an Animated Image component
  const FadeInImage = ({ source, style }) => {
    const fadeAnim = new Animated.Value(0); // Initial opacity is 0

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1, // Fade to opacity 1
        duration: 1000, // Duration in milliseconds
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.Image source={source} style={[style, { opacity: fadeAnim }]} />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.container}>
          <View style={styles.column}>
            {loading
              ? Array.from({ length: images.length / 3 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.skeleton,
                      { width: imageSize, height: imageSize, margin },
                    ]}
                  />
                ))
              : columnOneImages.map((image, index) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("PostDetails", { image })
                    }
                    key={index}
                  >
                    <FadeInImage
                      key={index}
                      source={image}
                      style={[
                        styles.image,
                        { width: imageSize, height: imageSize, margin },
                      ]}
                    />
                  </Pressable>
                ))}
          </View>
          <View style={styles.column}>
            {loading
              ? Array.from({ length: images.length / 3 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.skeleton,
                      { width: imageSize, height: imageSize, margin },
                    ]}
                  />
                ))
              : columnTwoImages.map((image, index) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("PostDetails", { image })
                    }
                    key={index}
                  >
                    <FadeInImage
                      source={image}
                      style={[
                        styles.image,
                        { width: imageSize, height: imageSize, margin },
                      ]}
                    />
                  </Pressable>
                ))}
          </View>
          <View style={styles.column}>
            {loading
              ? Array.from({ length: images.length / 3 }).map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.skeleton,
                      { width: imageSize, height: imageSize, margin },
                    ]}
                  />
                ))
              : columnThreeImages.map((image, index) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate("PostDetails", { image })
                    }
                    key={index}
                  >
                    <FadeInImage
                      key={index}
                      source={image}
                      style={[
                        styles.image,
                        { width: imageSize, height: imageSize, margin },
                      ]}
                    />
                  </Pressable>
                ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    paddingBottom: 10,
  },
  container: {
    flexDirection: "row",
  },
  column: {
    flex: 1,
  },
  image: {
    resizeMode: "cover",
  },
  skeleton: {
    backgroundColor: "#e0e0e0", // Grey color for skeleton loader
    borderRadius: 5, // Optional: rounded corners for skeleton loader
  },
});

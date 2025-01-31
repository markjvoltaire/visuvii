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
  const [loading, setLoading] = useState(true);
  const numColumns = 3;
  const spacing = 2;
  const imageSize =
    (Dimensions.get("window").width - spacing * (numColumns + 1)) / numColumns;

  const columnOneImages = images.filter((_, index) => index % 3 === 0);
  const columnTwoImages = images.filter((_, index) => index % 3 === 1);
  const columnThreeImages = images.filter((_, index) => index % 3 === 2);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const FadeInImage = ({ source, style, onPress }) => {
    const fadeAnim = new Animated.Value(0);
    const scaleAnim = new Animated.Value(1);

    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }, []);

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Animated.Image
          source={source}
          style={[
            style,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
      </Pressable>
    );
  };

  const renderColumn = (columnImages) => (
    <View style={styles.column}>
      {loading
        ? Array.from({ length: images.length / 3 }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.skeleton,
                styles.shimmer,
                { width: imageSize, height: imageSize, margin: spacing },
              ]}
            />
          ))
        : columnImages.map((image, index) => (
            <FadeInImage
              key={index}
              source={image}
              style={[
                styles.image,
                { width: imageSize, height: imageSize, margin: spacing },
              ]}
              onPress={() => navigation.navigate("PostDetails", { image })}
            />
          ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="grey"
          />
        }
      >
        <View style={styles.container}>
          {renderColumn(columnOneImages)}
          {renderColumn(columnTwoImages)}
          {renderColumn(columnThreeImages)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollViewContent: {
    paddingVertical: 12,
  },
  container: {
    flexDirection: "row",
    paddingHorizontal: 2,
  },
  column: {
    flex: 1,
  },
  image: {
    resizeMode: "cover",
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
  },
  skeleton: {
    backgroundColor: "#E5E7EB",
    borderRadius: 8,
    overflow: "hidden",
  },
  shimmer: {
    position: "relative",
    overflow: "hidden",
  },
  "@keyframes shimmer": {
    "0%": {
      backgroundColor: "#F3F4F6",
    },
    "50%": {
      backgroundColor: "#E5E7EB",
    },
    "100%": {
      backgroundColor: "#F3F4F6",
    },
  },
});

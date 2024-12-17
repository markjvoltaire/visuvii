import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import { supabase } from "../services/supabase";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Icon from "react-native-vector-icons/Ionicons";
import Tournaments from "../screens/Tournaments";
import UserProfile from "../screens/UserProfile";
import PostDetails from "../screens/PostDetails";
import TournamentDetails from "../screens/TournamentDetails";
import TournamentIntro from "../screens/TournamentIntro";
import CreateTournament from "../screens/CreateTournament";
import UploadMedia from "../screens/UploadMedia";

export default function Auth() {
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirect to login or another screen if needed
    } catch (error) {
      Alert.alert("Error signing out", error.message);
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      await deleteAccount();
      await deleteProfileSchema();
    } catch (error) {
      console.error("Error deactivating account", error);
      Alert.alert("Error", "Failed to deactivate account. Please try again.");
    }
  };

  const deleteUserTasks = async () => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("taskCreator", supabase.auth.currentUser.id);

      if (error) throw error;
      console.log("User tasks deleted successfully");
    } catch (error) {
      console.error("Error deleting tasks:", error);
    }
  };

  const deleteMessages = async () => {
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .like("threadID", `%${supabase.auth.currentUser.id}%`);

      if (error) throw error;
      console.log("Messages deleted successfully");
    } catch (error) {
      console.error("Error deleting messages:", error);
    }
  };

  const deleteAccount = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("user_id", supabase.auth.currentUser.id);

      if (error) throw error;
      console.log("Profile deleted successfully");
    } catch (error) {
      console.error("Error deleting profile:", error);
    }
  };

  const deleteProfileSchema = async () => {
    try {
      const { error } = await supabase.auth.api.deleteUser(
        supabase.auth.currentUser.id
      );

      if (error) throw error;
      console.log("User account deleted successfully");
      await handleSignOut();
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="PostDetails"
          component={PostDetails}
          options={{
            headerShown: true,
            headerBackTitle: "",
            headerTitle: "",
            headerTransparent: true,
            headerTitleStyle: {},
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    );
  };

  const TournamentStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="TournamentIntro" component={TournamentIntro} />

        <Stack.Screen
          name="Tournaments"
          component={Tournaments}
          options={{
            headerShown: true,
            headerBackTitle: "Go back",
            headerTitle: "",
            headerTransparent: true,
            headerTitleStyle: {
              color: "black",
            },
            headerTintColor: "black",
          }}
        />

        <Stack.Screen
          name="CreateTournament"
          component={CreateTournament}
          options={{
            headerShown: true,
            headerBackTitle: "Go back",
            headerTitle: "",
            headerTransparent: true,
            headerTitleStyle: {
              color: "black",
            },
            headerTintColor: "black",
          }}
        />
        <Stack.Screen
          name="TournamentDetails"
          component={TournamentDetails}
          options={{
            headerShown: true,
            headerBackTitle: "",
            headerTitle: "",
            headerTransparent: true,
            headerTitleStyle: {
              color: "black",
            },
            headerTintColor: "black",
          }}
        />

        <Stack.Screen
          name="UploadMedia"
          component={UploadMedia}
          options={{
            headerShown: true,
            headerBackTitle: "",
            headerTitle: "",
            headerTransparent: true,
            headerTitleStyle: {
              color: "black",
            },
            headerTintColor: "white",
          }}
        />
      </Stack.Navigator>
    );
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "white", // Set the color and opacity here; 0.5 means 50% opacity

          borderTopColor: "#EEE",
        },
      }}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          tabBarActiveTintColor: "#2CA58D", // Set active text color
          tabBarShowLabel: false,

          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Icon name="home" size={26} color="black" />
            ) : (
              <Icon name="home-outline" size={26} color="grey" />
            ),
        }}
        name="HomeStack"
        component={HomeStack}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarActiveTintColor: "#2CA58D", // Set active text color
          tabBarShowLabel: false,

          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Icon name="trophy" size={26} color="black" />
            ) : (
              <Icon name="trophy-outline" size={26} color="grey" />
            ),
        }}
        name="TournamentStack"
        component={TournamentStack}
      />

      <Tab.Screen
        options={{
          headerShown: false,
          tabBarActiveTintColor: "#2CA58D", // Set active text color
          tabBarShowLabel: false,

          tabBarIcon: ({ color, size, focused }) =>
            focused ? (
              <Icon name="person" size={26} color="black" />
            ) : (
              <Icon name="person-outline" size={26} color="grey" />
            ),
        }}
        name="ProfileStack"
        component={UserProfile}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF3B30",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

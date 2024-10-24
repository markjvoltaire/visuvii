import React, { useState, useEffect } from "react";
import { ActivityIndicator, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Auth from "./auth/Auth";
import NoAuth from "./auth/NoAuth";
import { supabase } from "./services/supabase";

export default function App() {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    const handleAuthStateChange = (_event, session) => {
      if (_event === "SIGNED_IN") {
        setAuth(session);
      } else if (_event === "SIGNED_OUT") {
        setAuth(null);
      }
    };

    const session = supabase.auth.session();
    setAuth(session);

    // Subscribe to authentication state changes
    const unsubscribe = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Cleanup subscription when component unmounts
    return () => {
      unsubscribe();
    };
  }, []);
  return (
    <NavigationContainer>
      {auth === null ? <NoAuth /> : <Auth auth={auth} />}
    </NavigationContainer>
  );
}

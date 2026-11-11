import { ConvexAuthProvider, useConvexAuth } from "@convex-dev/auth/react";
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";

import SignInScreen from "@/features/auth/sign-in";
import { authStorage } from "@/lib/auth-storage";
import { convex } from "@/lib/convex";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  if (isLoading) {
    return null; // the native splash screen covers the loading state
  }
  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="listing-editor" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ConvexAuthProvider client={convex} storage={authStorage}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AppContent />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}
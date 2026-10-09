import { ConvexAuthProvider, useConvexAuth } from "@convex-dev/auth/react";
import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import SignInScreen from "@/components/sign-in";
import { authStorage } from "@/lib/auth-storage";
import { convex } from "@/lib/convex";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  if (isLoading) {
    return null; // the splash overlay covers the loading state
  }
  return isAuthenticated ? <AppTabs /> : <SignInScreen />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ConvexAuthProvider client={convex} storage={authStorage}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppContent />
      </ThemeProvider>
    </ConvexAuthProvider>
  );
}

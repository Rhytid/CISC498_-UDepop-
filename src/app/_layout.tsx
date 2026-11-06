import { ConvexAuthProvider, useConvexAuth } from "@convex-dev/auth/react";
import {
  DarkTheme,
  DefaultTheme,
  Slot,
  ThemeProvider,
  usePathname,
} from "expo-router";
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
  const pathname = usePathname();
  const isPopup =
    pathname === "/UserMessaging/MessagePopup" ||
    pathname === "/UserMessaging/ConversationsPopup" ||
    pathname === "/ListingEditing/editingPopup"; // add this
  if (isLoading) {
    return null; // the splash overlay covers the loading state
  }
  if (!isAuthenticated) {
    return <SignInScreen />;
  }

  // Popup renders its own route with no tab bar
  if (isPopup) {
    return <Slot />;
  }
  return <AppTabs />;
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

import { DarkTheme, DefaultTheme, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "react-native";

import { AnimatedSplashOverlay } from "@/components/animated-icon";
import AppTabs from "@/components/app-tabs";
import React from "react";

import { ConvexProvider, ConvexReactClient } from "convex/react";

SplashScreen.preventAutoHideAsync();
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
export function TabLayout() {
  const colorScheme = useColorScheme();
  return <ConvexProvider client={convex}></ConvexProvider>;
}

//Wraps the original tablayout in the convex provider so the data is svaed to the cloud
export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <AnimatedSplashOverlay />
        <AppTabs />
      </ThemeProvider>
    </ConvexProvider>
  );
}

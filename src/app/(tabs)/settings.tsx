import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomTabInset, Spacing } from "@/constants/theme";
import { useThemePreference } from "@/shared/hooks/theme-preference";
import { useTheme } from "@/shared/hooks/use-theme";

export default function SettingsScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const insets = {
    ...safeAreaInsets,
    bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
  };
  const theme = useTheme();
  const { preference, toggleTheme } = useThemePreference();
  const isDark = preference === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background, paddingBottom: insets.bottom },
      ]}
    >
      <Text style={[styles.heading, { color: theme.text }]}>Settings</Text>

      <View
        style={[
          styles.row,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
        ]}
      >
        <Ionicons
          name={isDark ? "moon" : "sunny"}
          size={22}
          color={theme.text}
        />
        <View style={styles.rowCopy}>
          <Text style={[styles.rowTitle, { color: theme.text }]}>Dark mode</Text>
          <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
            {isDark ? "On" : "Off"}
          </Text>
        </View>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          accessibilityLabel="Toggle dark mode"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.three,
  },
  heading: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: Spacing.three,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
  },
  rowCopy: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 13,
  },
});
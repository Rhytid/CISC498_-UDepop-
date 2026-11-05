import { Ionicons } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type PlaceholderScreenProps = {
  title: string;
  message: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
};

/** Lightweight page for navigation destinations that are not built yet. */
export function PlaceholderScreen({
  title,
  message,
  icon = "construct-outline",
}: PlaceholderScreenProps) {
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <View
        style={[styles.iconWrap, { backgroundColor: theme.backgroundElement }]}
      >
        <Ionicons name={icon} size={40} color={theme.textSecondary} />
      </View>
      <ThemedText type="subtitle" style={styles.title}>
        {title}
      </ThemedText>
      <ThemedText themeColor="textSecondary" style={styles.message}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.three,
    padding: Spacing.five,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
  },
  message: {
    textAlign: "center",
    maxWidth: 360,
  },
});

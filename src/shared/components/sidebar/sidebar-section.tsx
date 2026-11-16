import React from "react";
import { StyleSheet, Text } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";

/**
 * Section heading shown above a group of sidebar items. Because expo-router's
 * headless Tabs only discovers <TabTrigger> children through <Fragment> or
 * <TabList>, section wrappers cannot nest triggers — so this is rendered as a
 * sibling heading in front of the section's items.
 */
export function SidebarSectionTitle({
  title,
  isOpen,
}: {
  title: string;
  isOpen: boolean;
}) {
  const theme = useTheme();

  if (!isOpen || !title) {
    return null;
  }

  return (
    <Text style={[styles.title, { color: theme.textSecondary }]}>
      {title.toUpperCase()}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 18,
    marginBottom: 4,
    paddingHorizontal: 12,
  },
});

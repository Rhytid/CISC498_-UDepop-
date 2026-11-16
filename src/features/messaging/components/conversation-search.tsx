import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";

export function ConversationSearch({
  value,
  onChangeText,
}: {
  value: string;
  onChangeText: (value: string) => void;
}) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.backgroundSelected },
      ]}
    >
      <Ionicons name="search" size={18} color={theme.textSecondary} />
      <TextInput
        accessibilityLabel="Search conversations"
        placeholder="Search conversations"
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, { color: theme.text }]}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 8,
    fontSize: 14,
  },
});

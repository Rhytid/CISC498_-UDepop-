import { useQuery } from "convex/react";
import { router } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { SIDEBAR_ACCENT } from "@/components/sidebar/navigation";
import { useTheme } from "@/hooks/use-theme";
import { api } from "../../convex/_generated/api";

// Lightweight messages screen that reuses the existing conversations query and
// routes into the existing message popup. Full chat UX lives in the popups.
export default function MessagesScreen() {
  const theme = useTheme();
  const conversations = useQuery(api.conversations.list);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.heading}>
        Messages
      </ThemedText>

      {conversations === undefined ? (
        <ThemedText themeColor="textSecondary">Loading…</ThemedText>
      ) : conversations === null || conversations.length === 0 ? (
        <ThemedText themeColor="textSecondary">
          No conversations yet. Message a seller from a listing to start one.
        </ThemedText>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(c) => c._id}
          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/UserMessaging/MessagePopup",
                  params: { conversationId: item._id },
                })
              }
              style={({ pressed }) => [
                styles.row,
                { borderBottomColor: theme.backgroundSelected },
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.rowMeta}>
                <Text style={[styles.name, { color: theme.text }]}>
                  {item.otherUser
                    ? `${item.otherUser.firstName} ${item.otherUser.lastName}`
                    : "Unknown user"}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.sub, { color: theme.textSecondary }]}
                >
                  {item.listing?.title ?? "Listing removed"}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[styles.sub, { color: theme.textSecondary }]}
                >
                  {item.lastMessage || "No messages yet"}
                </Text>
              </View>
              {item.unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: SIDEBAR_ACCENT }]}>
                  <Text style={styles.badgeText}>{item.unreadCount}</Text>
                </View>
              )}
            </Pressable>
          )}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  heading: {
    paddingBottom: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowMeta: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  sub: {
    fontSize: 13,
  },
  badge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    paddingHorizontal: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.7,
  },
});

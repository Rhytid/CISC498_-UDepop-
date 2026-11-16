import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { SIDEBAR_ACCENT } from "@/shared/components/sidebar/navigation";
import { Avatar } from "./avatar";
import { ListingThumbnail } from "./listing-thumbnail";
import type { Conversation } from "../types";
import { formatConversationTime, getDisplayName } from "../utils";

export function ConversationCard({
  conversation,
  selected,
  photoUrls,
  onPress,
}: {
  conversation: Conversation;
  selected: boolean;
  photoUrls?: Record<string, string | null>;
  onPress: () => void;
}) {
  const theme = useTheme();
  const listing = conversation.listing;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Conversation with ${getDisplayName(conversation.otherUser)}, ${listing?.title ?? "listing"}`}
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: selected
            ? theme.backgroundSelected
            : theme.background,
          borderColor: selected ? SIDEBAR_ACCENT : "transparent",
        },
        pressed && styles.pressed,
      ]}
    >
      <Avatar uri={conversation.otherUser?.profilePicture} size={44} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text
            numberOfLines={1}
            style={[styles.name, { color: theme.text }]}
          >
            {getDisplayName(conversation.otherUser)}
          </Text>
          <Text style={[styles.time, { color: theme.textSecondary }]}>
            {formatConversationTime(conversation.updatedAt)}
          </Text>
        </View>
        <View style={styles.listingRow}>
          <ListingThumbnail
            photos={listing?.photos}
            photoUrls={photoUrls}
            size={32}
          />
          <Text
            numberOfLines={1}
            style={[styles.listingTitle, { color: theme.textSecondary }]}
          >
            {listing?.title ?? "Listing unavailable"}
          </Text>
        </View>
        <View style={styles.bottomRow}>
          <Text
            numberOfLines={1}
            style={[styles.preview, { color: theme.textSecondary }]}
          >
            {conversation.lastMessage || "Start the conversation"}
          </Text>
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {conversation.unreadCount > 99
                  ? "99+"
                  : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.textSecondary}
        style={styles.chevron}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    marginBottom: 6,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: "700",
  },
  time: {
    fontSize: 11,
  },
  listingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  listingTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  preview: {
    flex: 1,
    fontSize: 12,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: SIDEBAR_ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  chevron: {
    marginLeft: -4,
  },
  pressed: {
    opacity: 0.75,
  },
});

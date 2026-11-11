import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/shared/hooks/use-theme";
import { Avatar } from "./avatar";
import { ListingThumbnail } from "./listing-thumbnail";
import type { Conversation } from "../types";
import { getDisplayName } from "../utils";

export function ChatHeader({
  conversation,
  isSeller,
  photoUrls,
  onBack,
}: {
  conversation: Conversation;
  isSeller?: boolean;
  photoUrls?: Record<string, string | null>;
  onBack?: () => void;
}) {
  const theme = useTheme();
  const listing = conversation.listing;

  return (
    <View
      style={[
        styles.container,
        { borderBottomColor: theme.backgroundSelected },
      ]}
    >
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to conversations"
          onPress={onBack}
          style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
        >
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>
      )}

      <Avatar uri={conversation.otherUser?.profilePicture} size={44} />

      <View style={styles.person}>
        <Text numberOfLines={1} style={[styles.name, { color: theme.text }]}>
          {getDisplayName(conversation.otherUser)}
        </Text>
        <Text style={[styles.role, { color: theme.textSecondary }]}>
          {isSeller === undefined
            ? "Marketplace conversation"
            : isSeller
              ? "You are the seller"
              : "You are the buyer"}
        </Text>
      </View>

      <View
        style={[
          styles.listingContext,
          { backgroundColor: theme.backgroundElement },
        ]}
      >
        <ListingThumbnail
          photos={listing?.photos}
          photoUrls={photoUrls}
          size={52}
        />
        <View style={styles.listingText}>
          <Text
            numberOfLines={1}
            style={[styles.listingTitle, { color: theme.text }]}
          >
            {listing?.title ?? "Listing unavailable"}
          </Text>
          <Text style={[styles.price, { color: theme.textSecondary }]}>
            {listing ? `$${listing.price.toFixed(2)}` : "Marketplace listing"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 76,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  person: {
    flex: 1,
    minWidth: 100,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
  },
  role: {
    marginTop: 3,
    fontSize: 12,
  },
  listingContext: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    maxWidth: "48%",
    borderRadius: 10,
    padding: 6,
  },
  listingText: {
    flex: 1,
    minWidth: 70,
  },
  listingTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  price: {
    marginTop: 3,
    fontSize: 12,
  },
  pressed: {
    opacity: 0.65,
  },
});

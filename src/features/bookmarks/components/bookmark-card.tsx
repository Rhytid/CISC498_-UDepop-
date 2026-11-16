import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ListingThumbnail } from "@/features/messaging/components/listing-thumbnail";
import { useTheme } from "@/shared/hooks/use-theme";
import { SIDEBAR_ACCENT } from "@/shared/components/sidebar/navigation";
import type { SavedBookmark } from "../types";

export function BookmarkCard({
  bookmark,
  selected,
  photoUrls,
  onPress,
}: {
  bookmark: SavedBookmark;
  selected: boolean;
  photoUrls?: Record<string, string | null>;
  onPress: () => void;
}) {
  const theme = useTheme();
  const listing = bookmark.listing;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${listing?.title ?? "Unavailable listing"}${listing?.seller?.username ? ` by ${listing.seller.username}` : ""}`}
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
      <ListingThumbnail
        photos={listing?.photos}
        photoUrls={photoUrls}
        size={58}
      />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>
            {listing?.title ?? "Listing unavailable"}
          </Text>
          {listing?.sold ? (
            <View style={[styles.badge, { backgroundColor: theme.background }]}>
              <Text style={[styles.badgeText, { color: theme.textSecondary }]}>
                Sold
              </Text>
            </View>
          ) : !listing ? (
            <Ionicons
              name="alert-circle-outline"
              size={17}
              color={theme.textSecondary}
            />
          ) : null}
        </View>
        {listing ? (
          <>
            <Text style={[styles.price, { color: theme.text }]}>
              {formatPrice(listing.price)}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.seller, { color: theme.textSecondary }]}
            >
              {listing.seller?.username
                ? `@${listing.seller.username}`
                : "Seller unavailable"}
            </Text>
          </>
        ) : (
          <Text style={[styles.seller, { color: theme.textSecondary }]}>
            This listing is no longer available
          </Text>
        )}
        <Text style={[styles.date, { color: theme.textSecondary }]}>
          Saved {new Date(bookmark.savedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={16}
        color={theme.textSecondary}
      />
    </Pressable>
  );
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(price);
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
    gap: 3,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    flex: 1,
    minWidth: 0,
    fontSize: 14,
    fontWeight: "700",
  },
  price: {
    fontSize: 13,
    fontWeight: "700",
  },
  seller: {
    fontSize: 12,
  },
  date: {
    fontSize: 11,
  },
  badge: {
    borderRadius: 7,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  pressed: {
    opacity: 0.75,
  },
});

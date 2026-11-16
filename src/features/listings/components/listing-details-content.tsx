import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Avatar } from "@/features/messaging/components/avatar";
import { BookmarkToggleButton } from "@/features/bookmarks/components/bookmark-toggle-button";
import { useTheme } from "@/shared/hooks/use-theme";
import type { SavedListing } from "@/features/bookmarks/types";
import { ListingImageGallery } from "./listing-image-gallery";

export function ListingDetailsContent({
  listing,
  photoUrls,
  initiallySaved,
}: {
  listing: SavedListing;
  photoUrls?: Record<string, string | null>;
  initiallySaved?: boolean;
}) {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ListingImageGallery
        key={`${listing._id}:${JSON.stringify(listing.photos)}`}
        photos={listing.photos}
        photoUrls={photoUrls}
      />

      <View style={styles.titleRow}>
        <View style={styles.titleCopy}>
          <Text style={[styles.title, { color: theme.text }]}>
            {listing.title}
          </Text>
          {listing.sold && (
            <View
              style={[
                styles.soldBadge,
                { backgroundColor: theme.backgroundSelected },
              ]}
            >
              <Text style={[styles.soldText, { color: theme.textSecondary }]}>
                Sold
              </Text>
            </View>
          )}
        </View>
        <BookmarkToggleButton
          listingId={listing._id}
          initiallySaved={initiallySaved}
        />
      </View>

      <Text style={[styles.price, { color: theme.text }]}>
        {formatPrice(listing.price)}
      </Text>

      <View
        style={[
          styles.sellerCard,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
        ]}
      >
        <Avatar uri={listing.seller?.profilePicture} size={42} />
        <View style={styles.sellerInfo}>
          <Text style={[styles.sellerName, { color: theme.text }]}>
            {listing.seller?.username
              ? `@${listing.seller.username}`
              : "Seller unavailable"}
          </Text>
          {(listing.seller?.firstName || listing.seller?.lastName) && (
            <Text style={[styles.sellerFullName, { color: theme.textSecondary }]}>
              {[listing.seller.firstName, listing.seller.lastName]
                .filter(Boolean)
                .join(" ")}
            </Text>
          )}
        </View>
        <Ionicons
          name="person-circle-outline"
          size={20}
          color={theme.textSecondary}
        />
      </View>

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: theme.backgroundElement,
            borderColor: theme.backgroundSelected,
          },
        ]}
      >
        <InfoRow label="Category" value={listing.category || "Not specified"} />
        <InfoRow
          label="Condition"
          value={listing.condition?.trim() || "Not specified"}
        />
        <InfoRow label="Availability" value={listing.sold ? "Sold" : "Available"} />
      </View>

      <View style={styles.descriptionSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Description
        </Text>
        <Text style={[styles.description, { color: theme.textSecondary }]}>
          {listing.description || "No description provided."}
        </Text>
      </View>

      {listing.tags.length > 0 && (
        <View style={styles.tags}>
          {listing.tags.map((tag) => (
            <View
              key={tag}
              style={[
                styles.tag,
                { backgroundColor: theme.backgroundSelected },
              ]}
            >
              <Text style={[styles.tagText, { color: theme.textSecondary }]}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const theme = useTheme();
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
    </View>
  );
}

function formatPrice(price: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(price);
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  titleCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
  },
  soldBadge: {
    alignSelf: "flex-start",
    marginTop: 7,
    borderRadius: 7,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  soldText: {
    fontSize: 11,
    fontWeight: "700",
  },
  price: {
    marginTop: -8,
    fontSize: 24,
    fontWeight: "800",
  },
  sellerCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "700",
  },
  sellerFullName: {
    marginTop: 2,
    fontSize: 12,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  infoRow: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128,128,128,0.25)",
  },
  infoLabel: {
    fontSize: 13,
  },
  infoValue: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  descriptionSection: {
    gap: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
  },
});

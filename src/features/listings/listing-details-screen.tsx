import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { router, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MessageButton from "@/features/messaging/components/CallingMessagePopup";
import { ListingDetailsContent } from "@/features/listings/components/listing-details-content";
import { useTheme } from "@/shared/hooks/use-theme";
import { SIDEBAR_ACCENT } from "@/shared/components/sidebar/navigation";
import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";

export default function ListingDetailsScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id?: string | string[] }>();
  const rawId = Array.isArray(id) ? id[0] : id;
  const listingId =
    rawId && rawId !== "index" ? (rawId as Id<"listings">) : undefined;
  const listing = useQuery(
    api.listings.get,
    listingId ? { id: listingId } : "skip",
  );
  const [messageError, setMessageError] = useState<string | null>(null);

  const photoIds = useMemo(
    () =>
      listing?.photos.filter(
        (photo) =>
          !photo.startsWith("http://") && !photo.startsWith("https://"),
      ) ?? [],
    [listing?.photos],
  );
  const photoUrls = useQuery(
    api.storage.getUrls,
    photoIds.length > 0 ? { storageIds: photoIds } : "skip",
  );

  return (
    <View style={[styles.page, { backgroundColor: theme.background }]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => router.back()}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.pressed,
        ]}
      >
        <Ionicons name="arrow-back" size={20} color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>Back</Text>
      </Pressable>

      {!listingId || listing === null ? (
        <View style={styles.center}>
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Listing not found.
          </Text>
        </View>
      ) : listing === undefined ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.textSecondary} />
          <Text style={[styles.message, { color: theme.textSecondary }]}>
            Loading listing…
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ListingDetailsContent
            listing={listing}
            photoUrls={photoUrls ?? undefined}
          />
          {messageError && (
            <Text accessibilityRole="alert" style={styles.error}>
              {messageError}
            </Text>
          )}
          <MessageButton
            listingId={listing._id}
            onError={(error) =>
              setMessageError(
                error instanceof Error
                  ? error.message
                  : "Could not start a conversation.",
              )
            }
            style={styles.messageButton}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#FFFFFF" />
            <Text style={styles.messageText}>Message Seller</Text>
          </MessageButton>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    width: "100%",
    maxWidth: 820,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingBottom: 28,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  message: {
    fontSize: 14,
  },
  messageButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: SIDEBAR_ACCENT,
  },
  messageText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  error: {
    color: "#F28B82",
    fontSize: 12,
  },
  pressed: {
    opacity: 0.75,
  },
});
